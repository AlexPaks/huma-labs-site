const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const browserPath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const remotePort = 9570;
const baseUrl = process.env.HUMA_BASE_URL || "http://localhost:4181";
const outputDir = path.join(process.cwd(), "docs", "implementation", "validation", "phase-10");

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
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "huma-phase10-"));
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
      if (message.method === "Runtime.consoleAPICalled" && ["warning", "error"].includes(message.params.type)) {
        consoleMessages.push(message.params.args.map((arg) => arg.value ?? arg.description ?? "").join(" "));
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
    async function typeInto(selector, value) {
      return evaluate(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return false;
        const proto = el.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
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

    const report = {};

    // 1. Contact form on the homepage: fill and submit.
    await navigate(`${baseUrl}/he#contact`);
    await sleep(300);
    await typeInto('input[name="fullName"]', "בדיקת Phase 10");
    await typeInto('input[name="email"]', "phase10@example.com");
    await click(".concept-form button[type=submit]");
    await sleep(800);
    report.contactFormSubmit = await evaluate(`(() => ({
      statusText: document.querySelector(".concept-form__actions p[aria-live]")?.textContent ?? null,
      submitDisabled: document.querySelector(".concept-form button[type=submit]")?.disabled ?? null
    }))()`);

    // 2. Contact form validation error path: honeypot is empty by default so this just checks a truly empty required field is unaffected (all fields optional here) — instead verify a second, fresh submit still works (idempotent) is out of scope; check honeypot field presence & hidden state.
    report.honeypotFieldState = await evaluate(`(() => {
      const wrap = document.querySelector(".concept-form__honeypot");
      const input = wrap?.querySelector("input");
      return {
        present: !!input,
        ariaHiddenOnWrapper: wrap?.getAttribute("aria-hidden"),
        tabIndex: input?.tabIndex
      };
    })()`);

    // 3. Full Insight flow -> result -> insight-delivery form submission.
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
    await typeInto('.concept-result__contact input[name="fullName"]', "מקבל בדיקה");
    await typeInto('.concept-result__contact input[name="email"]', "recipient@example.com");
    await click(".concept-result__contact .concept-form button[type=submit]");
    await sleep(800);
    report.insightDeliverySubmit = await evaluate(`(() => ({
      statusText: document.querySelector(".concept-result__contact .concept-form__actions p[aria-live]")?.textContent ?? null
    }))()`);

    report.consoleMessages = consoleMessages;

    console.log(JSON.stringify(report, null, 2));
    fs.writeFileSync(path.join(outputDir, "phase10-form-check.json"), JSON.stringify(report, null, 2));
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
