import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";

const root = process.cwd();
const distDir = path.join(root, "dist");
const browserPath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const remotePort = 9591;
const previewPort = 4599;
const baseUrl = `http://localhost:${previewPort}`;

// Mirrors config/seo-pages.json + src/i18n/language.tsx's getLocalizedPath —
// kept in sync manually, following this repo's plain-JS-duplication
// convention for build scripts that cannot import TypeScript source.
const SUPPORTED_LANGUAGES = ["he", "en"];
const INDEXABLE_ROUTES = [
  { pageId: "home", pathSegments: (language) => [language] },
  { pageId: "insight", pathSegments: (language) => [language, "insight"] },
];

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

async function waitForHttp(url, attempts = 60) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      await new Promise((resolve, reject) => {
        http
          .get(url, (res) => {
            res.resume();
            resolve(res.statusCode);
          })
          .on("error", reject);
      });
      return;
    } catch {
      await sleep(250);
    }
  }
  throw new Error(`Server at ${url} did not become ready`);
}

async function waitForDebugger() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      return await httpGetJson(`http://127.0.0.1:${remotePort}/json/list`);
    } catch {
      await sleep(250);
    }
  }
  throw new Error("Remote debugger did not become ready");
}

async function main() {
  if (!fs.existsSync(distDir)) {
    throw new Error("dist/ does not exist — run `vite build` before prerendering.");
  }

  const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");
  const previewProcess = spawn(
    process.execPath,
    [viteBin, "preview", "--port", String(previewPort), "--strictPort"],
    { cwd: root, stdio: "ignore" },
  );

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "huma-prerender-"));
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
  const results = [];

  try {
    await waitForHttp(baseUrl);
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

    await send("Page.enable");
    await send("Runtime.enable");

    for (const language of SUPPORTED_LANGUAGES) {
      for (const route of INDEXABLE_ROUTES) {
        const segments = route.pathSegments(language);
        const routePath = `/${segments.join("/")}`;
        await navigate(`${baseUrl}${routePath}`);
        const html = await evaluate("'<!doctype html>\\n' + document.documentElement.outerHTML");

        const outputDir = path.join(distDir, ...segments);
        fs.mkdirSync(outputDir, { recursive: true });
        const outputFile = path.join(outputDir, "index.html");
        fs.writeFileSync(outputFile, html);

        results.push({ routePath, outputFile: path.relative(root, outputFile), bytes: html.length });
      }
    }
  } finally {
    try {
      if (ws) ws.close();
    } catch {
      // ignore
    }
    previewProcess.kill();
  }

  console.log(JSON.stringify({ prerendered: results }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
