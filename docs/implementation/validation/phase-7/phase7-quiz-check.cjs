const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const browserPath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const remotePort = 9558;
const baseUrl = process.env.HUMA_BASE_URL || "http://localhost:4177";
const outputDir = path.join(process.cwd(), "docs", "implementation", "validation", "phase-7");

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
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "huma-phase7-quiz-"));
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
    const consoleMessages = [];
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
        const type = message.params.type;
        if (type === "warning" || type === "error") {
          const text = message.params.args.map((arg) => arg.value ?? arg.description ?? "").join(" ");
          consoleMessages.push(`[${type}] ${text}`);
        }
      }
      if (message.method === "Runtime.exceptionThrown") {
        consoleMessages.push(`[pageerror] ${message.params.exceptionDetails.text}`);
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
      await sleep(700);
    }

    async function evaluate(expression) {
      const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) {
        throw new Error(JSON.stringify(result.exceptionDetails));
      }
      return result.result.value;
    }

    async function navigate(url) {
      await send("Page.navigate", { url });
      await waitForLoad();
    }

    async function click(selector) {
      return evaluate(`(() => {
        const node = document.querySelector(${JSON.stringify(selector)});
        if (!node) return false;
        node.click();
        return true;
      })()`);
    }

    async function answerCurrentQuestion() {
      return evaluate(`(() => {
        const option = document.querySelector(".concept-answer-list__option, .concept-c-insight-flow__answer");
        if (option) {
          option.click();
          return "option";
        }
        const textarea = document.querySelector(".concept-insight-flow__textarea, .concept-c-insight-flow__textarea");
        if (textarea) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
          setter.call(textarea, "תשובה לדוגמה עבור בדיקת Phase 7");
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
          return "textarea";
        }
        return "none";
      })()`);
    }

    async function clickContinue() {
      return click(".concept-insight-flow__controls .concept-button, .concept-c-insight-flow__controls .concept-c-button--filled");
    }

    async function state() {
      return evaluate(`(() => ({
        url: location.href,
        hasQuestionState: !!document.querySelector(".concept-insight-flow__layout, .concept-c-insight-flow__question"),
        hasResultState: !!document.querySelector(".concept-result__capability, .concept-c-result__capability"),
        progressText: document.querySelector(".concept-insight-flow__progress-label, .concept-c-insight-flow__progress-label")?.textContent ?? null,
        debugResult: window.__HUMA_DEBUG_LAST_INSIGHT_RESULT__ ?? null,
        storage: Object.fromEntries(
          Object.keys(window.localStorage)
            .filter((key) => key.startsWith("huma-quiz-"))
            .map((key) => [key, window.localStorage.getItem(key)]),
        )
      }))()`);
    }

    async function completeFullFlow(startSelector) {
      await click(startSelector);
      await sleep(400);
      for (let i = 0; i < 6; i += 1) {
        await answerCurrentQuestion();
        await sleep(150);
        await clickContinue();
        await sleep(350);
      }
    }

    await send("Page.enable");
    await send("Runtime.enable");

    const report = {};

    // 1. Full completion flow, Concept A, Hebrew.
    await navigate(`${baseUrl}/he/insight`);
    await completeFullFlow(".concept-insight-overview .concept-button, .concept-c-insight-overview .concept-c-button--filled");
    report.fullCompletionConceptA = await state();

    // 2. Restart from the result screen.
    await click(".concept-result__restart, .concept-c-result__restart");
    await sleep(400);
    report.afterRestart = await state();

    // 3. Persistence across a full page reload mid-flow.
    await navigate(`${baseUrl}/he/insight`);
    await click(".concept-insight-overview .concept-button, .concept-c-insight-overview .concept-c-button--filled");
    await sleep(400);
    await answerCurrentQuestion();
    await sleep(150);
    await clickContinue();
    await sleep(350);
    const beforeReload = await state();
    await navigate(`${baseUrl}/he/insight`);
    const afterReload = await state();
    report.persistenceAcrossReload = { beforeReload, afterReload };

    // 4. Language switch mid-flow must NOT reset progress (regression check for the bug found in Phase 6).
    await navigate(`${baseUrl}/en/insight`);
    const afterLanguageSwitch = await state();
    report.languageSwitchMidFlow = { beforeSwitch: afterReload, afterSwitch: afterLanguageSwitch };

    console.log(JSON.stringify({ report, consoleMessages }, null, 2));
    fs.writeFileSync(
      path.join(outputDir, "phase7-quiz-check.json"),
      JSON.stringify({ report, consoleMessages }, null, 2),
    );
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
