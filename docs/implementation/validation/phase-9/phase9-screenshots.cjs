const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const browserPath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const remotePort = 9563;
const baseUrl = "http://localhost:4180";
const outDir = path.join(process.cwd(), "docs", "implementation", "validation", "phase-9");

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = ""; res.on("data", (c) => (data += c));
      res.on("end", () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
    }).on("error", reject);
  });
}
async function waitForDebugger() {
  for (let i = 0; i < 50; i++) { try { return await httpGetJson(`http://127.0.0.1:${remotePort}/json/list`); } catch { await sleep(250); } }
  throw new Error("no debugger");
}

async function main() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "huma-phase9-shots-"));
  const browser = spawn(browserPath, [
    `--user-data-dir=${userDataDir}`, "--headless=new", "--disable-gpu",
    "--no-first-run", "--no-default-browser-check",
    `--remote-debugging-port=${remotePort}`, "about:blank",
  ], { stdio: "ignore", detached: true });
  browser.unref();

  const targets = await waitForDebugger();
  const pageTarget = targets.find((t) => t.type === "page");
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  const pending = new Map();
  let nextId = 0; let loadResolver = null;
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
      return;
    }
    if (message.method === "Page.loadEventFired" && loadResolver) { loadResolver(); loadResolver = null; }
  };
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  function send(method, params = {}) {
    const id = ++nextId;
    return new Promise((resolve, reject) => { pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
  }
  async function waitForLoad() { await new Promise((r) => { loadResolver = r; }); await sleep(600); }
  async function evaluate(expression) {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function navigate(url) { await send("Page.navigate", { url }); await waitForLoad(); }
  async function click(selector) {
    return evaluate(`(() => { const n = document.querySelector(${JSON.stringify(selector)}); if(!n) return false; n.click(); return true; })()`);
  }
  async function answerCurrent() {
    return evaluate(`(() => {
      const option = document.querySelector(".concept-answer-list__option, .concept-c-insight-flow__answer");
      if (option) { option.click(); return "option"; }
      const textarea = document.querySelector(".concept-insight-flow__textarea, .concept-c-insight-flow__textarea");
      if (textarea) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        setter.call(textarea, "תשובה לדוגמה");
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        return "textarea";
      }
      return "none";
    })()`);
  }
  async function setViewport(width, height, mobile) {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
  }
  async function screenshot(fileName) {
    const shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(outDir, fileName), Buffer.from(shot.data, "base64"));
  }

  await send("Page.enable");
  await send("Runtime.enable");

  // Desktop, Concept A, Hebrew: capture the loading state, then the final dynamic result.
  await setViewport(1440, 1000, false);
  await navigate(`${baseUrl}/he/insight`);
  await click(".concept-insight-overview .concept-button");
  await sleep(400);
  for (let i = 0; i < 5; i++) {
    await answerCurrent();
    await sleep(150);
    await click(".concept-insight-flow__controls .concept-button");
    await sleep(300);
  }
  // Answer the last question and screenshot mid-flight while the loading state is visible.
  await answerCurrent();
  await sleep(150);
  await click(".concept-insight-flow__controls .concept-button");
  await sleep(150);
  await screenshot("phase9-loading-he-desktop.png");
  await sleep(1200);
  await screenshot("phase9-result-dynamic-he-desktop.png");

  // Concept C, English, mobile: full result screenshot.
  await setViewport(390, 900, true);
  await navigate(`${baseUrl}/en/insight?concept=c`);
  await click(".concept-c-insight-overview .concept-c-button--filled");
  await sleep(400);
  for (let i = 0; i < 6; i++) {
    await answerCurrent();
    await sleep(150);
    await click(".concept-c-insight-flow__controls .concept-c-button--filled");
    await sleep(350);
  }
  await sleep(600);
  await screenshot("phase9-result-dynamic-c-en-mobile.png");

  ws.close();
}
main().catch((e) => { console.error(e.stack || e.message); process.exit(1); });
