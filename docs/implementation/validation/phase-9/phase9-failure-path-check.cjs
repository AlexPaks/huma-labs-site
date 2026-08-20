const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const { spawn, exec } = require("child_process");

const browserPath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const remotePort = 9562;
const baseUrl = process.env.HUMA_BASE_URL || "http://localhost:4180";
const outputDir = path.join(process.cwd(), "docs", "implementation", "validation", "phase-9");

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
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "huma-phase9-fail-"));
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
      return evaluate(`(() => { const n = document.querySelector(${JSON.stringify(selector)}); if(!n) return false; n.click(); return true; })()`);
    }
    async function answerCurrent() {
      return evaluate(`(() => {
        const option = document.querySelector(".concept-answer-list__option");
        if (option) { option.click(); return "option"; }
        const textarea = document.querySelector(".concept-insight-flow__textarea");
        if (textarea) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
          setter.call(textarea, "בדיקת כשל");
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
          return "textarea";
        }
        return "none";
      })()`);
    }
    async function state() {
      return evaluate(`(() => ({
        analyzingVisible: !!document.querySelector('[data-primary-state="analyzing"]'),
        resultVisible: !!document.querySelector('[data-primary-state="result"]'),
        errorHeading: document.querySelector('[data-primary-state="analyzing"] h1, [data-primary-state="analyzing"] h2')?.textContent ?? null,
        capabilityText: document.querySelector(".concept-result__capability")?.textContent ?? null,
        storage: window.localStorage.getItem("huma-quiz-organizational-insight-1.0.0")
      }))()`);
    }

    await send("Page.enable");
    await send("Runtime.enable");

    const report = {};

    // API server is stopped before this script runs (see orchestrating shell commands).
    await navigate(`${baseUrl}/he/insight`);
    await click(".concept-insight-overview .concept-button");
    await sleep(400);
    for (let i = 0; i < 6; i += 1) {
      await answerCurrent();
      await sleep(150);
      await click(".concept-insight-flow__controls .concept-button");
      await sleep(400);
    }
    // Give the failed fetch time to resolve and show the error state.
    await sleep(1500);
    report.afterFailedAnalysis = await state();

    // Retry while the server is still down — should fail again, answers still intact.
    await click(".concept-analysis-state__actions .concept-button");
    await sleep(1500);
    report.afterRetryStillDown = await state();

    // Accept the safe fallback result.
    await click(".concept-analysis-state__actions .concept-text-link");
    await sleep(400);
    report.afterFallbackAccepted = await state();

    console.log(JSON.stringify(report, null, 2));
    fs.writeFileSync(path.join(outputDir, "phase9-failure-path-check.json"), JSON.stringify(report, null, 2));
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
