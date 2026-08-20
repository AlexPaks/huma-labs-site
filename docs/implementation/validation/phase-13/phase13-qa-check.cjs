const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const browserPath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const remotePort = 9610;
const baseUrl = process.env.HUMA_BASE_URL || "http://localhost:4187";
const outputDir = path.join(process.cwd(), "docs", "implementation", "validation", "phase-13");
const axeSource = fs.readFileSync(path.join(process.cwd(), "node_modules", "axe-core", "axe.min.js"), "utf8");
const TRACKING_HOST_PATTERNS = ["googletagmanager.com", "google-analytics.com", "facebook.net", "tiktok.com", "analytics.tiktok.com"];

const VIEWPORTS = {
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
};

const MATRIX = [];
for (const concept of ["a", "c"]) {
  for (const language of ["he", "en"]) {
    for (const page of ["home", "insight"]) {
      MATRIX.push({ concept, language, page });
    }
  }
}

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
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      return await httpGetJson(`http://127.0.0.1:${remotePort}/json/list`);
    } catch {
      await sleep(250);
    }
  }
  throw new Error("Remote debugger did not become ready");
}

function routePath(language, page) {
  return page === "insight" ? `/${language}/insight` : `/${language}`;
}
function withConcept(pathAndQuery, concept) {
  return concept === "a" ? pathAndQuery : `${pathAndQuery}${pathAndQuery.includes("?") ? "&" : "?"}concept=c`;
}
function axeSeverityCounts(violations) {
  const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  for (const violation of violations) {
    if (counts[violation.impact] !== undefined) counts[violation.impact] += 1;
  }
  return counts;
}

async function main() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "huma-phase13-"));
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
  const consoleErrors = [];
  const trackingRequests = [];

  try {
    const targets = await waitForDebugger();
    const pageTarget = targets.find((target) => target.type === "page");
    ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    const pending = new Map();
    let nextId = 0;
    let loadResolver = null;
    let currentPageErrors = [];

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
        const text = message.params.args.map((arg) => arg.value ?? arg.description ?? "").join(" ");
        currentPageErrors.push(text);
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
      await sleep(500);
    }
    async function evaluate(expression) {
      const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    }
    async function navigate(url) {
      currentPageErrors = [];
      await send("Page.navigate", { url });
      await waitForLoad();
    }
    async function click(selector) {
      return evaluate(
        `(() => { const n = document.querySelector(${JSON.stringify(selector)}); if(!n) return false; n.scrollIntoView({block:"center"}); n.click(); return true; })()`,
      );
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
        const option = document.querySelector(".concept-answer-list__option, .concept-c-insight-flow__answer");
        if (option) { option.click(); return "option"; }
        const textarea = document.querySelector(".concept-insight-flow__textarea, .concept-c-insight-flow__textarea-wrap textarea");
        if (textarea) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
          setter.call(textarea, "test");
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
          return "textarea";
        }
        return "none";
      })()`);
    }
    async function setViewport(viewport) {
      await send("Emulation.setDeviceMetricsOverride", viewport);
    }
    async function screenshot(fileName) {
      const shot = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(outputDir, fileName), Buffer.from(shot.data, "base64"));
    }
    async function runAxe() {
      await evaluate(axeSource);
      return evaluate(`
        axe.run(document, { resultTypes: ["violations"] }).then((r) =>
          r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodeCount: v.nodes.length }))
        )
      `);
    }

    await send("Page.enable");
    await send("Runtime.enable");
    await send("Network.enable");

    const report = { consentBanner: null, pages: [], quizInProgress: null, insightResult: null, conceptParity: null, contactFormFailure: null };

    // 1. Consent banner accessibility, before it's ever accepted.
    await navigate(`${baseUrl}/he`);
    await setViewport(VIEWPORTS.desktop);
    await sleep(300);
    report.consentBanner = {
      role: await evaluate(`document.querySelector(".concept-consent-banner")?.getAttribute("role")`),
      ariaLabel: await evaluate(`document.querySelector(".concept-consent-banner")?.getAttribute("aria-label")`),
      axeViolations: await runAxe(),
    };
    await screenshot("phase13-consent-banner-axe-baseline.png");

    // Accept all so subsequent screenshots show real page content.
    await click(".concept-consent-banner__actions .concept-button");
    await sleep(300);

    // 2. Responsive + accessibility + RTL/LTR sweep across the full concept x language x page matrix.
    for (const entry of MATRIX) {
      const url = `${baseUrl}${withConcept(routePath(entry.language, entry.page), entry.concept)}`;
      await navigate(url);
      const dir = await evaluate("document.documentElement.dir");
      const lang = await evaluate("document.documentElement.lang");

      await setViewport(VIEWPORTS.mobile);
      await sleep(300);
      await screenshot(`phase13-${entry.concept}-${entry.language}-${entry.page}-mobile.png`);
      const axeMobile = await runAxe();

      await setViewport(VIEWPORTS.desktop);
      await sleep(300);
      await screenshot(`phase13-${entry.concept}-${entry.language}-${entry.page}-desktop.png`);
      const axeDesktop = await runAxe();

      report.pages.push({
        ...entry,
        dir,
        lang,
        expectedDir: entry.language === "he" ? "rtl" : "ltr",
        dirCorrect: dir === (entry.language === "he" ? "rtl" : "ltr"),
        langCorrect: lang === entry.language,
        consoleErrors: [...currentPageErrors],
        axeMobile: axeSeverityCounts(axeMobile),
        axeDesktop: axeSeverityCounts(axeDesktop),
        axeMobileViolations: axeMobile,
        axeDesktopViolations: axeDesktop,
      });
    }

    // 3. Distinct dynamic UI states not covered by the static matrix above: an
    //    in-progress quiz question, and the dynamic insight result screen.
    await navigate(`${baseUrl}/he/insight`);
    await click(".concept-insight-overview .concept-button, .concept-c-insight-overview .concept-button");
    await sleep(400);
    await answerCurrent();
    await sleep(200);
    report.quizInProgress = { axeViolations: await runAxe() };
    await screenshot("phase13-quiz-in-progress-axe.png");

    for (let i = 0; i < 6; i += 1) {
      await answerCurrent();
      await sleep(150);
      await click(".concept-insight-flow__controls .concept-button, .concept-c-insight-flow__controls .concept-button");
      await sleep(350);
    }
    await sleep(800);
    report.insightResult = { axeViolations: await runAxe() };
    await screenshot("phase13-insight-result-axe.png");

    // 4. Concept text parity — same messages should render in both concepts
    //    for the same language/page (different layout, same approved copy).
    await navigate(`${baseUrl}/he`);
    const textA = await evaluate(`document.body.innerText`);
    await navigate(withConcept(`${baseUrl}/he`, "c"));
    const textC = await evaluate(`document.body.innerText`);
    const wordsA = new Set(textA.split(/\s+/u).filter((w) => w.length > 2));
    const wordsC = new Set(textC.split(/\s+/u).filter((w) => w.length > 2));
    const intersection = [...wordsA].filter((w) => wordsC.has(w));
    report.conceptParity = {
      wordsInA: wordsA.size,
      wordsInC: wordsC.size,
      sharedWords: intersection.length,
      overlapRatio: intersection.length / Math.max(wordsA.size, wordsC.size),
    };

    // 5. Failure-state regression on Concept C (new coverage — Phases 10/11
    //    only exercised the contact form on Concept A): submit without
    //    CONTACT_NOTIFICATION_EMAIL configured and confirm the accessible
    //    failure state renders correctly.
    await navigate(withConcept(`${baseUrl}/he`, "c"));
    await sleep(300);
    await typeInto('input[name="fullName"]', "Phase 13 QA");
    await typeInto('input[name="email"]', "phase13@example.com");
    await click(".concept-form button[type=submit]");
    await sleep(800);
    report.contactFormFailure = {
      statusText: await evaluate(`document.querySelector(".concept-form__description, .concept-form__status")?.textContent ?? null`),
      axeViolations: await runAxe(),
    };
    await screenshot("phase13-contact-form-failure-concept-c.png");

    report.trackingRequests = trackingRequests;

    console.log(JSON.stringify(report, null, 2));
    fs.writeFileSync(path.join(outputDir, "phase13-qa-check.json"), JSON.stringify(report, null, 2));
  } finally {
    try {
      if (ws) ws.close();
    } catch {
      // ignore
    }
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
