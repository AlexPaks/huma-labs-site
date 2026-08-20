const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const browserPath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const remotePort = 9555;
const baseUrl = process.env.HUMA_BASE_URL || "http://127.0.0.1:4174";
const outputDir = path.join(
  process.cwd(),
  "docs",
  "implementation",
  "validation",
  "phase-5",
);
const reportPath = path.join(outputDir, "phase5-concept-c-check.json");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", reject);
  });
}

async function waitForDebugger() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      return await httpGetJson(`http://127.0.0.1:${remotePort}/json/list`);
    } catch {
      await sleep(250);
    }
  }

  throw new Error("Remote debugger did not become ready");
}

async function main() {
  const userDataDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "huma-phase5-concept-c-"),
  );

  const browser = spawn(
    browserPath,
    [
      `--user-data-dir=${userDataDir}`,
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--remote-debugging-port=${remotePort}`,
      "about:blank",
    ],
    { stdio: "ignore", detached: true },
  );
  browser.unref();

  let ws;

  try {
    const targets = await waitForDebugger();
    const pageTarget = targets.find((target) => target.type === "page");

    if (!pageTarget) {
      throw new Error("No page target found");
    }

    ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    const pending = new Map();
    const consoleMessages = [];
    let nextId = 0;
    let loadResolver = null;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.id && pending.has(message.id)) {
        const { resolve, reject } = pending.get(message.id);
        pending.delete(message.id);

        if (message.error) {
          reject(new Error(message.error.message));
        } else {
          resolve(message.result);
        }

        return;
      }

      if (message.method === "Page.loadEventFired" && loadResolver) {
        loadResolver();
        loadResolver = null;
      }

      if (message.method === "Runtime.consoleAPICalled") {
        const type = message.params.type;
        if (type === "warning" || type === "error") {
          const text = message.params.args
            .map((arg) => arg.value ?? arg.description ?? "")
            .join(" ");
          consoleMessages.push(`[${type}] ${text}`);
        }
      }

      if (message.method === "Runtime.exceptionThrown") {
        consoleMessages.push(
          `[pageerror] ${message.params.exceptionDetails.text}`,
        );
      }
    };

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    function send(method, params = {}) {
      const id = ++nextId;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function waitForLoad() {
      await new Promise((resolve) => {
        loadResolver = resolve;
      });
      await sleep(900);
    }

    async function setViewport(width, height, mobile) {
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile,
      });
    }

    async function evaluate(expression) {
      const result = await send("Runtime.evaluate", {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      return result.result.value;
    }

    async function navigate(url) {
      await send("Page.navigate", { url });
      await waitForLoad();
    }

    async function capture(fileName) {
      const metrics = await send("Page.getLayoutMetrics");
      const width = Math.ceil(metrics.contentSize.width);
      const height = Math.ceil(metrics.contentSize.height);
      const screenshot = await send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
        clip: {
          x: 0,
          y: 0,
          width,
          height,
          scale: 1,
        },
      });

      fs.writeFileSync(
        path.join(outputDir, fileName),
        Buffer.from(screenshot.data, "base64"),
      );

      return { fileName, width, height };
    }

    async function captureViewport(fileName, width, height) {
      const screenshot = await send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
        clip: {
          x: 0,
          y: 0,
          width,
          height,
          scale: 1,
        },
      });

      fs.writeFileSync(
        path.join(outputDir, fileName),
        Buffer.from(screenshot.data, "base64"),
      );

      return { fileName, width, height };
    }

    async function getPageState() {
      return evaluate(`(() => ({
        title: document.title,
        url: location.href,
        textLength: document.body ? document.body.innerText.trim().length : 0,
        hasMain: !!document.querySelector("main"),
        hasViteOverlay: !!document.querySelector("vite-error-overlay"),
        duplicateIds: (() => {
          const ids = [...document.querySelectorAll("[id]")].map((node) => node.id);
          return ids.filter((id, index) => ids.indexOf(id) !== index);
        })(),
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
      }))()`);
    }

    async function clickSelector(selector) {
      return evaluate(`(() => {
        const node = document.querySelector(${JSON.stringify(selector)});
        if (!node) return false;
        node.click();
        return true;
      })()`);
    }

    async function fillFirstInteractiveAnswer() {
      return evaluate(`(() => {
        const option = document.querySelector(".concept-c-insight-flow__answer");
        if (option) {
          option.click();
          return "option";
        }

        const textarea = document.querySelector(".concept-c-insight-flow__textarea");
        if (textarea) {
          textarea.value = "תשובה לדוגמה";
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
          return "textarea";
        }

        return "none";
      })()`);
    }

    async function waitForSelector(selector) {
      for (let attempt = 0; attempt < 50; attempt += 1) {
        const exists = await evaluate(
          `Boolean(document.querySelector(${JSON.stringify(selector)}))`,
        );
        if (exists) {
          return true;
        }
        await sleep(200);
      }

      return false;
    }

    async function completeInsightFlow(language, mode) {
      const isDesktop = mode === "desktop";
      const viewport = isDesktop
        ? { width: 1440, height: 1600, mobile: false }
        : { width: 390, height: 1200, mobile: true };

      await setViewport(viewport.width, viewport.height, viewport.mobile);
      await navigate(`${baseUrl}/${language}/insight?concept=c`);
      await clickSelector(".concept-c-insight-overview .concept-c-button--filled");
      await waitForSelector(".concept-c-insight-flow__question");
      const questionScreenshot = await captureViewport(
        `concept-c-insight-${language}-question-${mode}.png`,
        viewport.width,
        viewport.height,
      );

      for (let index = 0; index < 6; index += 1) {
        await fillFirstInteractiveAnswer();
        await clickSelector(".concept-c-insight-flow__controls .concept-c-button--filled");
        await sleep(350);
      }

      await waitForSelector(".concept-c-result__capability");
      const resultScreenshot = await captureViewport(
        `concept-c-insight-${language}-result-${mode}.png`,
        viewport.width,
        viewport.height,
      );

      return {
        questionScreenshot,
        resultScreenshot,
        resultState: await getPageState(),
      };
    }

    async function captureHome(language, mode) {
      if (mode === "desktop") {
        await setViewport(1440, 3000, false);
      } else {
        await setViewport(390, 3600, true);
      }

      await navigate(`${baseUrl}/${language}?concept=c`);
      return capture(`concept-c-home-${language}-${mode}.png`);
    }

    async function captureInsightIntro(language, mode) {
      if (mode === "desktop") {
        await setViewport(1440, 2400, false);
      } else {
        await setViewport(390, 3200, true);
      }

      await navigate(`${baseUrl}/${language}/insight?concept=c`);
      return capture(`concept-c-insight-${language}-intro-${mode}.png`);
    }

    await send("Page.enable");
    await send("Runtime.enable");
    await send("Log.enable");

    const artifacts = {
      baseUrl,
      home: {
        heDesktop: await captureHome("he", "desktop"),
        enDesktop: await captureHome("en", "desktop"),
        heMobile: await captureHome("he", "mobile"),
        enMobile: await captureHome("en", "mobile"),
      },
      insightIntro: {
        heDesktop: await captureInsightIntro("he", "desktop"),
        enDesktop: await captureInsightIntro("en", "desktop"),
        heMobile: await captureInsightIntro("he", "mobile"),
        enMobile: await captureInsightIntro("en", "mobile"),
      },
      insightFlow: {
        heDesktop: await completeInsightFlow("he", "desktop"),
        enDesktop: await completeInsightFlow("en", "desktop"),
        heMobile: await completeInsightFlow("he", "mobile"),
        enMobile: await completeInsightFlow("en", "mobile"),
      },
      consoleMessages,
      finalState: await getPageState(),
    };

    fs.writeFileSync(reportPath, JSON.stringify(artifacts, null, 2));
    console.log(JSON.stringify(artifacts, null, 2));
  } finally {
    try {
      if (ws) {
        ws.close();
      }
    } catch {}
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
