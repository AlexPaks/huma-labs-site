const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const browserPath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const remotePort = 9444;
const outputPath = path.join(
  process.cwd(),
  "docs",
  "implementation",
  "validation",
  "phase1-console-check.json",
);

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
    path.join(os.tmpdir(), "huma-phase1-console-check-"),
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
      await sleep(800);
    }

    async function getPageState() {
      const expression = `(() => ({
        title: document.title,
        url: location.href,
        textLength: document.body ? document.body.innerText.trim().length : 0,
        hasMain: !!document.querySelector("main"),
        hasViteOverlay: !!document.querySelector("vite-error-overlay"),
        overflow: document.documentElement.scrollWidth > window.innerWidth
      }))()`;
      const result = await send("Runtime.evaluate", {
        expression,
        returnByValue: true,
      });
      return result.result.value;
    }

    await send("Page.enable");
    await send("Runtime.enable");
    await send("Log.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 1600,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await send("Page.navigate", { url: "http://127.0.0.1:4173/" });
    await waitForLoad();
    const home = await getPageState();

    await send("Page.navigate", { url: "http://127.0.0.1:4173/insight" });
    await waitForLoad();
    const insight = await getPageState();

    const payload = {
      home,
      insight,
      consoleMessages,
    };

    fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
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
