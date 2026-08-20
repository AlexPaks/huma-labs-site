import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const validationDir = path.join(root, "docs", "implementation", "validation", "phase-15.5");
const requiredAssets = [
  "public/images/concept-d/hero-collective-system.jpg",
  "public/images/concept-d/insight-collective-map.jpg",
  "public/images/concept-d/capabilities-modular-system.jpg",
  "public/images/concept-d/outcomes-collective-movement.jpg",
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function main() {
  fs.mkdirSync(validationDir, { recursive: true });
  const checks = [];
  const issues = [];

  function record(name, passed, detail = null) {
    checks.push({ name, passed, detail });
    if (!passed) issues.push(name);
  }

  const siteConfig = read("src/config/site.ts");
  const conceptMode = read("src/concepts/conceptMode.tsx");
  const styles = read("src/styles.css");
  const browserReport = JSON.parse(
    read("docs/implementation/validation/phase-15.5/phase15-5-concept-d-check.json"),
  );
  const masterPlan = read("docs/implementation/huma-website-master-plan.md");

  record(
    "Concept D is a supported concept",
    /SupportedConcept\s*=\s*"a"\s*\|\s*"c"\s*\|\s*"d"/.test(siteConfig),
  );
  record("Concept D is the configured default", /defaultConcept:\s*"d"/.test(siteConfig));
  record("Concept D is accepted by concept resolution", /value === "d"/.test(conceptMode));
  record(
    "Concept D presentation layer is scoped by data-concept",
    styles.includes('.concept-site-shell[data-concept="d"]'),
  );
  record(
    "Concept D visual reference is persisted",
    exists("docs/design-concepts/images/concept-d-home-desktop.png"),
  );

  for (const asset of requiredAssets) {
    const assetPath = path.join(root, asset);
    record(
      "Concept D asset exists and is non-empty: " + asset,
      fs.existsSync(assetPath) && fs.statSync(assetPath).size > 0,
    );
  }

  record("Concept A implementation remains present", exists("src/concepts/concept-a"));
  record("Concept C implementation remains present", exists("src/concepts/concept-c"));
  record("Browser QA passed", browserReport.passed === true);
  record(
    "Browser QA verified Hebrew RTL and English LTR",
    browserReport.defaultConcept.heDesktop.dir === "rtl" &&
      browserReport.defaultConcept.enDesktop.dir === "ltr",
  );
  record(
    "Browser QA found no console errors",
    Array.isArray(browserReport.consoleErrors) && browserReport.consoleErrors.length === 0,
  );
  record(
    "Master Plan records Phase 15.5 and Concept D default",
    /Phase 15\.5[\s\S]*Concept D/.test(masterPlan) &&
      /defaultConcept[\s\S]*"d"/.test(masterPlan),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    checks,
    passed: issues.length === 0,
  };

  fs.writeFileSync(
    path.join(validationDir, "phase15-5-validation-report.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
  if (issues.length > 0) process.exitCode = 1;
}

main();
