const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");
const { randomInt } = require("crypto");

const workspaceRoot = "D:/alexp/HumaLab Projects/huma-labs-site";
const browserPath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const outputName = process.argv[2] || "contact-anchor-check";
const baseUrl = process.argv[3] || "http://localhost:5173";
const remotePort = Number(process.argv[4] || 9600 + randomInt(0, 200));
const outputDir = path.join(
  workspaceRoot,
  "docs",
  "implementation",
  "validation",
  "phase-4",
);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
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
  for (let attempt = 0; attempt < 40; attempt += 1) {
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
    path.join(os.tmpdir(), "huma-contact-anchor-check-"),
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
      await sleep(500);
    }

    async function setViewport(width, height) {
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width <= 430,
      });
    }

    async function evaluate(expression) {
      const result = await send("Runtime.evaluate", {
        expression,
        returnByValue: true,
      });
      return result.result.value;
    }

    async function navigate(url, width = 1440, height = 1600) {
      await setViewport(width, height);
      await send("Page.navigate", { url });
      await waitForLoad();
      return await waitForAnchorSettled();
    }

    async function waitForAnchorSettled() {
      for (let attempt = 0; attempt < 50; attempt += 1) {
        const state = await getPageState();
        if (!state.url.includes("#")) {
          return state;
        }

        if (state.targetVisible) {
          return state;
        }

        await sleep(100);
      }

      return getPageState();
    }

    async function waitFor(predicateExpression, timeoutMs = 5000) {
      const startedAt = Date.now();

      while (Date.now() - startedAt < timeoutMs) {
        const result = await evaluate(predicateExpression);
        if (result) {
          return true;
        }
        await sleep(100);
      }

      return false;
    }

    async function getPageState() {
      return evaluate(`(() => {
        const target = document.getElementById("contact");
        const header = document.querySelector(".concept-header");
        const rect = target ? target.getBoundingClientRect() : null;
        const headerRect = header ? header.getBoundingClientRect() : null;
        const viewportHeight = window.innerHeight;
        const targetVisible =
          !!rect &&
          !!headerRect &&
          rect.top >= headerRect.height - 8 &&
          rect.top <= viewportHeight - 120 &&
          rect.bottom > headerRect.height + 48;

        return {
          title: document.title,
          url: location.href,
          pathname: location.pathname,
          hash: location.hash,
          scrollY: Math.round(window.scrollY),
          viewportWidth: window.innerWidth,
          viewportHeight,
          targetExists: !!target,
          targetCount: document.querySelectorAll("#contact").length,
          targetTop: rect ? Math.round(rect.top) : null,
          targetBottom: rect ? Math.round(rect.bottom) : null,
          targetVisible,
          headerHeight: headerRect ? Math.round(headerRect.height) : null,
          htmlLang: document.documentElement.lang,
          htmlDir: document.documentElement.dir,
          hasMain: !!document.querySelector("main"),
          hasForm: !!document.querySelector("#contact form"),
          hasOverlay: !!document.querySelector("vite-error-overlay")
        };
      })()`);
    }

    async function click(selector) {
      const clicked = await evaluate(`(() => {
        const target = document.querySelector(${JSON.stringify(selector)});
        if (!(target instanceof HTMLElement)) {
          return false;
        }

        target.click();
        return true;
      })()`);

      if (!clicked) {
        throw new Error(`Could not click selector: ${selector}`);
      }

      await sleep(250);
      return waitForAnchorSettled();
    }

    async function resetScrollTop() {
      await evaluate("window.scrollTo({ top: 0, behavior: 'auto' }); true");
      await sleep(100);
      return getPageState();
    }

    async function historyBack() {
      await evaluate("history.back(); true");
      await waitFor("location.pathname === '/he' && location.hash === ''", 5000);
      await sleep(700);
      return getPageState();
    }

    async function historyForward() {
      await evaluate("history.forward(); true");
      await waitFor("location.pathname === '/he' && location.hash === '#contact'", 5000);
      return waitForAnchorSettled();
    }

    async function captureScreenshot(fileName) {
      const result = await send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
      });

      const outputPath = path.join(outputDir, fileName);
      fs.writeFileSync(outputPath, Buffer.from(result.data, "base64"));
      return outputPath;
    }

    await send("Page.enable");
    await send("Runtime.enable");
    await send("Log.enable");

    const results = {};

    results.directHe = await navigate(`${baseUrl}/he#contact`);
    results.directHeScreenshot = await captureScreenshot("contact-anchor-he-direct.png");

    results.directEn = await navigate(`${baseUrl}/en#contact`);
    results.directEnScreenshot = await captureScreenshot("contact-anchor-en-direct.png");

    await navigate(`${baseUrl}/he`);
    results.sameRouteHeFirst = await click("header a[href$='#contact']");
    await resetScrollTop();
    results.sameRouteHeRepeat = await click("header a[href$='#contact']");
    results.sameRouteHeRepeatScreenshot = await captureScreenshot("contact-anchor-he-repeat.png");

    await navigate(`${baseUrl}/en`);
    results.sameRouteEnFirst = await click("header a[href$='#contact']");
    await resetScrollTop();
    results.sameRouteEnRepeat = await click("header a[href$='#contact']");
    results.sameRouteEnRepeatScreenshot = await captureScreenshot("contact-anchor-en-repeat.png");

    await navigate(`${baseUrl}/he/insight`);
    results.crossRouteHe = await click("header a[href$='#contact']");
    results.crossRouteHeScreenshot = await captureScreenshot("contact-anchor-he-from-insight.png");

    await navigate(`${baseUrl}/en/insight`);
    results.crossRouteEn = await click("header a[href$='#contact']");
    results.crossRouteEnScreenshot = await captureScreenshot("contact-anchor-en-from-insight.png");

    await navigate(`${baseUrl}/he#contact`);
    await send("Page.reload");
    await waitForLoad();
    results.refreshHe = await waitForAnchorSettled();

    await navigate(`${baseUrl}/en#contact`);
    await send("Page.reload");
    await waitForLoad();
    results.refreshEn = await waitForAnchorSettled();

    await navigate(`${baseUrl}/he`);
    results.historyStart = await resetScrollTop();
    await click("header a[href$='#contact']");
    results.historyBack = await historyBack();
    results.historyForward = await historyForward();

    const payload = {
      generatedAt: new Date().toISOString(),
      baseUrl,
      consoleMessages,
      results,
    };

    fs.writeFileSync(
      path.join(outputDir, `${outputName}.json`),
      JSON.stringify(payload, null, 2),
      "utf8",
    );
  } finally {
    if (ws) {
      ws.close();
    }

    if (browser.pid) {
      spawn("taskkill", ["/PID", String(browser.pid), "/T", "/F"], {
        stdio: "ignore",
      });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
