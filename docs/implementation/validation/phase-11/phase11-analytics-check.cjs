const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const browserPath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const remotePort = 9580;
const baseUrl = process.env.HUMA_BASE_URL || "http://localhost:4182";
const outputDir = path.join(process.cwd(), "docs", "implementation", "validation", "phase-11");
const TRACKING_HOST_PATTERNS = ["googletagmanager.com", "google-analytics.com", "facebook.net", "tiktok.com", "analytics.tiktok.com"];

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
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "huma-phase11-"));
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
    ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    const pending = new Map();
    const analyticsLogs = [];
    const trackingRequests = [];
    let nextId = 0;
    let loadResolver = null;

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
      if (message.method === "Runtime.consoleAPICalled") {
        const text = message.params.args.map((arg) => arg.value ?? arg.description ?? "").join(" ");
        if (text.includes("[mock-analytics-provider]")) {
          analyticsLogs.push(text);
        }
      }
      if (message.method === "Network.requestWillBeSent") {
        const url = message.params.request.url;
        if (TRACKING_HOST_PATTERNS.some((host) => url.includes(host))) {
          trackingRequests.push(url);
        }
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
      await sleep(600);
    }
    async function evaluate(expression) {
      const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    }
    async function navigate(url) {
      await send("Page.navigate", { url });
      await waitForLoad();
    }
    async function click(selector) {
      return evaluate(`(() => { const n = document.querySelector(${JSON.stringify(selector)}); if(!n) return false; n.scrollIntoView({block:"center"}); n.click(); return true; })()`);
    }
    async function typeInto(selector, value) {
      return evaluate(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return false;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        setter.call(el, ${JSON.stringify(value)});
        el.dispatchEvent(new Event("input", { bubbles: true }));
        return true;
      })()`);
    }
    async function answerCurrent() {
      return evaluate(`(() => {
        const option = document.querySelector(".concept-answer-list__option");
        if (option) { option.click(); return "option"; }
        const textarea = document.querySelector(".concept-insight-flow__textarea");
        if (textarea) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
          setter.call(textarea, "test");
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
          return "textarea";
        }
        return "none";
      })()`);
    }

    await send("Page.enable");
    await send("Runtime.enable");
    await send("Network.enable");

    const report = {};

    // 1. First load: consent banner visible, unresolved, no analytics/marketing consent yet.
    await navigate(`${baseUrl}/he`);
    await sleep(400);
    report.initialLoad = await evaluate(`(() => ({
      bannerVisible: !!document.querySelector(".concept-consent-banner"),
      bannerTitle: document.querySelector(".concept-consent-banner__title")?.textContent ?? null
    }))()`);
    report.analyticsLogsAfterInitialLoad = [...analyticsLogs];

    // 2. Accept all — banner disappears, preferences saved.
    await click(".concept-consent-banner__actions .concept-button");
    await sleep(300);
    report.afterAcceptAll = await evaluate(`(() => ({
      bannerVisible: !!document.querySelector(".concept-consent-banner"),
      storedConsent: window.localStorage.getItem("huma-consent")
    }))()`);

    // 3. Navigate to trigger page_view, and switch language to trigger language_changed.
    analyticsLogs.length = 0;
    await navigate(`${baseUrl}/he/insight`);
    await sleep(300);
    await click('.concept-language-switch__button:not(.concept-language-switch__button--active)');
    await sleep(300);
    report.navigationAndLanguageLogs = [...analyticsLogs];
    report.urlAfterLanguageSwitch = await evaluate("location.href");

    // 4. Home hero CTA click.
    analyticsLogs.length = 0;
    await navigate(`${baseUrl}/he`);
    await sleep(400);
    await click(".concept-hero__actions .concept-button, .concept-c-hero__actions .concept-button");
    await sleep(300);
    report.heroCtaLogs = [...analyticsLogs];

    // 5. Full Quiz + insight analysis flow.
    analyticsLogs.length = 0;
    await navigate(`${baseUrl}/he/insight`);
    await click(".concept-insight-overview .concept-button");
    await sleep(400);
    for (let i = 0; i < 6; i += 1) {
      await answerCurrent();
      await sleep(150);
      await click(".concept-insight-flow__controls .concept-button");
      await sleep(350);
    }
    await sleep(800);
    report.quizAndAnalysisLogs = [...analyticsLogs];

    // 6. Contact form view + start + submit.
    analyticsLogs.length = 0;
    await navigate(`${baseUrl}/he#contact`);
    await sleep(400);
    await typeInto('input[name="fullName"]', "Phase 11 test");
    await typeInto('input[name="email"]', "phase11@example.com");
    await click(".concept-form button[type=submit]");
    await sleep(800);
    report.contactFormLogs = [...analyticsLogs];

    report.trackingRequests = trackingRequests;

    console.log(JSON.stringify(report, null, 2));
    fs.writeFileSync(path.join(outputDir, "phase11-analytics-check.json"), JSON.stringify(report, null, 2));
  } finally {
    try {
      if (ws) ws.close();
    } catch {}
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
