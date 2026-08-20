import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const phase13ValidationDir = path.join(root, "docs", "implementation", "validation", "phase-13");

function readJson(relativePath) {
  const raw = fs.readFileSync(path.join(root, relativePath), "utf8").replace(/^﻿/, "");
  return JSON.parse(raw);
}

function readTextFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function main() {
  ensureDirectory(phase13ValidationDir);
  const issues = [];
  const checks = [];

  function record(name, passed, detail) {
    checks.push({ name, passed, detail: detail ?? null });
    if (!passed) issues.push(name);
  }

  // 1. axe-core is present as the approved accessibility-testing dependency.
  const packageJson = readJson("package.json");
  record("dependency: axe-core is installed as a devDependency", Boolean(packageJson.devDependencies?.["axe-core"]));
  record("dependency: axe-core distributable build is present", fileExists("node_modules/axe-core/axe.min.js"));

  // 2. Distinct nav landmark labels exist in both languages (regression
  //    guard for the landmark-unique fix: header/mobile-menu/footer nav
  //    must never share the same accessible name again).
  const navHe = readJson("messages/he/navigation.json");
  const navEn = readJson("messages/en/navigation.json");
  for (const [lang, nav] of [["he", navHe], ["en", navEn]]) {
    const labels = [nav.aria.primary, nav.aria.primaryMobile, nav.aria.primaryFooter];
    record(`navigation (${lang}): primary/primaryMobile/primaryFooter are all distinct`, new Set(labels).size === 3, JSON.stringify(labels));
  }

  // 3. sr-only utility class exists (used by InsightPage's persistent
  //    page-has-heading-one fix).
  const stylesCss = readTextFile("src/styles.css");
  record("styles.css: .sr-only utility class is defined", /\.sr-only\s*\{/.test(stylesCss));

  // 4. Form button contrast fix regression guard: the filled form-button
  //    background must not be the lighter --color-accent (3.97:1 with white
  //    text, an AA failure) — it must be the darker --color-accent-deep.
  const formButtonBlockMatch = stylesCss.match(
    /\.concept-form \.concept-button,\s*\n\.concept-contact \.concept-button,\s*\n\.concept-result__contact \.concept-button \{([^}]*)\}/,
  );
  record(
    "styles.css: filled form button uses --color-accent-deep (WCAG AA contrast fix)",
    Boolean(formButtonBlockMatch && formButtonBlockMatch[1].includes("--color-accent-deep")),
  );

  // 5. InsightPage carries a persistent h1 across every page-state branch.
  const insightPageSource = readTextFile("src/pages/InsightPage.tsx");
  record(
    "InsightPage.tsx: a persistent pageHeading h1 is defined and referenced in every branch",
    insightPageSource.includes('const pageHeading = <h1 className="sr-only">') &&
      (insightPageSource.match(/\{pageHeading\}/g) ?? []).length >= 6,
  );

  // 6. Latest QA sweep evidence, if present, shows zero violations and zero
  //    real tracking requests (the sweep itself requires a live browser +
  //    server, so this only checks the saved report from the last run).
  if (fileExists("docs/implementation/validation/phase-13/phase13-qa-check.json")) {
    const qaReport = readJson("docs/implementation/validation/phase-13/phase13-qa-check.json");
    const totalViolations =
      qaReport.consentBanner.axeViolations.length +
      qaReport.pages.reduce((sum, p) => sum + p.axeMobileViolations.length + p.axeDesktopViolations.length, 0) +
      qaReport.quizInProgress.axeViolations.length +
      qaReport.insightResult.axeViolations.length +
      qaReport.contactFormFailure.axeViolations.length;
    record("qa-sweep evidence: zero axe violations across the full matrix", totalViolations === 0, `totalViolations=${totalViolations}`);
    record("qa-sweep evidence: zero real tracking requests observed", qaReport.trackingRequests.length === 0);
    record(
      "qa-sweep evidence: RTL/LTR direction correct on every page in the matrix",
      qaReport.pages.every((p) => p.dirCorrect && p.langCorrect),
    );
    record(
      "qa-sweep evidence: concept parity word-overlap is high (no major content drift)",
      qaReport.conceptParity.overlapRatio > 0.85,
      `overlapRatio=${qaReport.conceptParity.overlapRatio}`,
    );
  } else {
    record("qa-sweep evidence: docs/implementation/validation/phase-13/phase13-qa-check.json exists", false);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    checks,
    passed: issues.length === 0,
  };

  fs.writeFileSync(path.join(phase13ValidationDir, "phase13-validation-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));

  if (issues.length > 0) {
    process.exitCode = 1;
  }
}

main();
