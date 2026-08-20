const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const browserPath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const remotePort = 9655;
const baseUrl = process.env.HUMA_BASE_URL || "http://127.0.0.1:4173";
const outputDir = path.join(process.cwd(), "docs", "implementation", "validation", "phase-15.5");
const viewports = {
  desktop: { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
};
const conceptDAssets = [
  "/images/concept-d/hero-collective-system.jpg",
  "/images/concept-d/insight-collective-map.jpg",
  "/images/concept-d/capabilities-modular-system.jpg",
  "/images/concept-d/outcomes-collective-movement.jpg",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (response) => {
        let data = "";
        response.on("data", (chunk) => (data += chunk));
        response.on("end", () => {
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
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      return await httpGetJson("http://127.0.0.1:" + remotePort + "/json/list");
    } catch {
      await sleep(250);
    }
  }
  throw new Error("Remote debugger did not become ready.");
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "huma-phase15-5-"));
  const browser = spawn(
    browserPath,
    [
      "--user-data-dir=" + profileDir,
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--remote-debugging-port=" + remotePort,
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  let ws;

  try {
    const targets = await waitForDebugger();
    const pageTarget = targets.find((target) => target.type === "page");
    ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    const pending = new Map();
    let nextId = 0;
    let loadResolver = null;
    let pageConsoleErrors = [];

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id && pending.has(message.id)) {
        const { resolve, reject } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
        return;
      }
      if (message.method === "Page.loadEventFired" && loadResolver) {
        loadResolver();
        loadResolver = null;
      }
      if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
        pageConsoleErrors.push(
          message.params.args.map((argument) => argument.value ?? argument.description ?? "").join(" "),
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

    async function evaluate(expression) {
      const result = await send("Runtime.evaluate", {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    }

    async function navigate(url) {
      pageConsoleErrors = [];
      const loaded = new Promise((resolve) => {
        loadResolver = resolve;
      });
      await send("Page.navigate", { url });
      await loaded;
      await sleep(700);
    }

    async function setViewport(viewport) {
      await send("Emulation.setDeviceMetricsOverride", viewport);
      await sleep(300);
    }

    async function screenshot(fileName) {
      const shot = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(outputDir, fileName), Buffer.from(shot.data, "base64"));
    }

    async function fullPageScreenshot(fileName) {
      const metrics = await send("Page.getLayoutMetrics");
      const { width, height } = metrics.cssContentSize;
      const shot = await send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
        clip: { x: 0, y: 0, width, height, scale: 1 },
      });
      fs.writeFileSync(path.join(outputDir, fileName), Buffer.from(shot.data, "base64"));
    }

    async function inspectPage() {
      return evaluate(
        '(() => ({' +
          'url: location.href,' +
          'title: document.title,' +
          'concept: document.body.dataset.concept ?? null,' +
          'lang: document.documentElement.lang,' +
          'dir: document.documentElement.dir,' +
          'hasMain: Boolean(document.querySelector("main")),' +
          'mainTextLength: document.querySelector("main")?.innerText.trim().length ?? 0,' +
          'hasFrameworkOverlay: Boolean(document.querySelector("vite-error-overlay, nextjs-portal")),' +
          'horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,' +
          'robots: document.querySelector(\'meta[name="robots"]\')?.content ?? null,' +
          'heroBackground: document.querySelector(".concept-hero__ledger") ? getComputedStyle(document.querySelector(".concept-hero__ledger")).backgroundImage : null' +
        '}))()',
      );
    }

    async function verifyAssets() {
      return evaluate(
        "Promise.all(" +
          JSON.stringify(conceptDAssets) +
          ".map((src) => new Promise((resolve) => {" +
            "const image = new Image();" +
            "image.onload = () => resolve({ src, loaded: true, width: image.naturalWidth, height: image.naturalHeight });" +
            "image.onerror = () => resolve({ src, loaded: false, width: 0, height: 0 });" +
            "image.src = src;" +
          "})))",
      );
    }

    await send("Page.enable");
    await send("Runtime.enable");

    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl,
      browser: "Microsoft Edge headless via CDP",
      defaultConcept: {},
      previews: {},
      interaction: {},
      consoleErrors: [],
    };

    await setViewport(viewports.desktop);
    await navigate(baseUrl + "/he");
    await evaluate('document.querySelector(".concept-consent-banner__actions .concept-button")?.click()');
    await sleep(300);
    report.defaultConcept.heDesktop = await inspectPage();
    report.defaultConcept.assets = await verifyAssets();
    report.consoleErrors.push(...pageConsoleErrors);
    await screenshot("concept-d-he-home-desktop.png");
    await fullPageScreenshot("concept-d-he-home-full.png");

    await setViewport(viewports.mobile);
    report.defaultConcept.heMobile = await inspectPage();
    await screenshot("concept-d-he-home-mobile.png");

    await setViewport(viewports.desktop);
    await navigate(baseUrl + "/en");
    report.defaultConcept.enDesktop = await inspectPage();
    report.consoleErrors.push(...pageConsoleErrors);
    await screenshot("concept-d-en-home-desktop.png");

    await setViewport(viewports.mobile);
    report.defaultConcept.enMobile = await inspectPage();
    await screenshot("concept-d-en-home-mobile.png");

    await setViewport(viewports.desktop);
    await navigate(baseUrl + "/he?concept=a");
    report.previews.conceptA = await inspectPage();
    report.consoleErrors.push(...pageConsoleErrors);

    await navigate(baseUrl + "/he?concept=c");
    report.previews.conceptC = await inspectPage();
    report.consoleErrors.push(...pageConsoleErrors);

    await navigate(baseUrl + "/he");
    const clicked = await evaluate(
      '(() => {' +
        'const link = document.querySelector(\'.concept-header__link[href^="/he/insight"]\');' +
        "if (!link) return false;" +
        "link.click();" +
        "return true;" +
      "})()",
    );
    await sleep(800);
    report.interaction = { clicked, state: await inspectPage() };
    report.consoleErrors.push(...pageConsoleErrors);

    report.passed =
      report.defaultConcept.heDesktop.concept === "d" &&
      report.defaultConcept.heDesktop.dir === "rtl" &&
      report.defaultConcept.enDesktop.concept === "d" &&
      report.defaultConcept.enDesktop.dir === "ltr" &&
      report.defaultConcept.assets.every((asset) => asset.loaded) &&
      !report.defaultConcept.heDesktop.horizontalOverflow &&
      !report.defaultConcept.heMobile.horizontalOverflow &&
      !report.defaultConcept.enDesktop.horizontalOverflow &&
      !report.defaultConcept.enMobile.horizontalOverflow &&
      report.previews.conceptA.concept === "a" &&
      report.previews.conceptC.concept === "c" &&
      report.previews.conceptA.robots?.includes("noindex") &&
      report.previews.conceptC.robots?.includes("noindex") &&
      report.interaction.clicked &&
      report.interaction.state.url.includes("/he/insight") &&
      report.interaction.state.concept === "d" &&
      report.consoleErrors.length === 0;

    fs.writeFileSync(
      path.join(outputDir, "phase15-5-concept-d-check.json"),
      JSON.stringify(report, null, 2) + "\n",
    );
    console.log(JSON.stringify(report, null, 2));
    if (!report.passed) process.exitCode = 1;
  } finally {
    if (ws?.readyState === WebSocket.OPEN) ws.close();
    browser.kill();
    await Promise.race([
      new Promise((resolve) => browser.once("exit", resolve)),
      sleep(1500),
    ]);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        fs.rmSync(profileDir, { recursive: true, force: true });
        break;
      } catch (error) {
        if (attempt === 2) throw error;
        await sleep(500);
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
