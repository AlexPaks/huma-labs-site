const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const browserPath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const remotePort = 9556;
const baseUrl = process.env.HUMA_BASE_URL || "http://localhost:4176";

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
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "huma-phase6-switcher-"));
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
      await sleep(700);
    }

    async function evaluate(expression) {
      const result = await send("Runtime.evaluate", {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
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
        const nodes = [...document.querySelectorAll(${JSON.stringify(selector)})];
        if (!nodes.length) return false;
        nodes[nodes.length - 1].click();
        return true;
      })()`);
    }

    async function state() {
      return evaluate(`(() => ({
        url: location.href,
        concept: document.body.dataset.concept,
        conceptStorage: window.localStorage.getItem("huma-concept"),
        switcherPresent: !!document.querySelector(".concept-review-switcher"),
        pressedA: document.querySelector('.concept-review-switcher__option[aria-pressed="true"]')?.textContent ?? null
      }))()`);
    }

    await send("Page.enable");
    await send("Runtime.enable");

    const report = {};

    // 1. Initial load: default concept A, switcher present.
    await navigate(`${baseUrl}/he`);
    report.initial = await state();

    // 2. Click "Concept C" (second switcher button) and confirm URL + storage update.
    await click(".concept-review-switcher__option");
    await sleep(300);
    const afterFirstClick = await state();

    // The first option is "Concept A" (already active); click the second (Concept C).
    await evaluate(`(() => {
      const buttons = [...document.querySelectorAll(".concept-review-switcher__option")];
      buttons[1]?.click();
    })()`);
    await sleep(400);
    report.afterSwitchToC = await state();

    // 3. Reload WITHOUT ?concept= in the URL — storage should keep concept=c active.
    await navigate(`${baseUrl}/he`);
    report.afterReloadNoQuery = await state();

    // 4. Switch back to A via the switcher, confirm URL loses the query param and storage updates.
    await evaluate(`(() => {
      const buttons = [...document.querySelectorAll(".concept-review-switcher__option")];
      buttons[0]?.click();
    })()`);
    await sleep(400);
    report.afterSwitchBackToA = await state();

    // 5. Quiz-state preservation: switch to C, start the Insight flow, answer Q1, switch concept mid-flow.
    await navigate(`${baseUrl}/he/insight?concept=c`);
    await click(".concept-c-insight-overview .concept-c-button--filled");
    await sleep(400);
    await evaluate(`(() => {
      const option = document.querySelector(".concept-c-insight-flow__answer");
      option?.click();
    })()`);
    await sleep(200);
    await click(".concept-c-insight-flow__controls .concept-c-button--filled");
    await sleep(400);
    const beforeSwitchMidFlow = await evaluate(`(() => ({
      progressLabel: document.querySelector(".concept-c-insight-flow__progress")?.textContent ?? null,
      hasQuestionState: !!document.querySelector(".concept-c-insight-flow__question")
    }))()`);

    await evaluate(`(() => {
      const buttons = [...document.querySelectorAll(".concept-review-switcher__option")];
      buttons[0]?.click();
    })()`);
    await sleep(400);
    const afterSwitchToAMidFlow = await evaluate(`(() => ({
      url: location.href,
      progressLabel: document.querySelector(".concept-insight-flow__progress-label")?.textContent ?? null,
      hasQuestionState: !!document.querySelector(".concept-insight-flow__layout")
    }))()`);

    await evaluate(`(() => {
      const buttons = [...document.querySelectorAll(".concept-review-switcher__option")];
      buttons[1]?.click();
    })()`);
    await sleep(400);
    const afterSwitchBackToCMidFlow = await evaluate(`(() => ({
      url: location.href,
      progressLabel: document.querySelector(".concept-c-insight-flow__progress")?.textContent ?? null,
      hasQuestionState: !!document.querySelector(".concept-c-insight-flow__question")
    }))()`);

    report.quizStatePreservation = {
      beforeSwitchMidFlow,
      afterSwitchToAMidFlow,
      afterSwitchBackToCMidFlow,
    };

    console.log(JSON.stringify(report, null, 2));
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
