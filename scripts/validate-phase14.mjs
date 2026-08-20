import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const phase14ValidationDir = path.join(root, "docs", "implementation", "validation", "phase-14");

function readTextFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

// Mirrors src/config/site.ts's siteConfig.defaultConcept — the confirmed
// final production concept decision (Phase 14). Kept in sync manually,
// following this repo's plain-JS-duplication convention for build scripts
// that cannot import TypeScript source.
const CONFIRMED_FINAL_CONCEPT = "a";

function main() {
  ensureDirectory(phase14ValidationDir);
  const issues = [];
  const checks = [];

  function record(name, passed, detail) {
    checks.push({ name, passed, detail: detail ?? null });
    if (!passed) issues.push(name);
  }

  const siteConfigSource = readTextFile("src/config/site.ts");
  const defaultConceptMatch = siteConfigSource.match(/defaultConcept:\s*"([ac])"/);

  record(
    "site config: defaultConcept matches the confirmed final production concept decision",
    Boolean(defaultConceptMatch) && defaultConceptMatch[1] === CONFIRMED_FINAL_CONCEPT,
    JSON.stringify({ found: defaultConceptMatch?.[1] ?? null, expected: CONFIRMED_FINAL_CONCEPT }),
  );

  // Concept C's implementation is retained (not removed) per the confirmed
  // Phase 14 scope decision — this is a regression guard against accidental
  // deletion, not an endorsement of Concept C as production.
  record("concept C implementation is retained in the codebase (not removed)", fs.existsSync(path.join(root, "src", "concepts", "concept-c")));

  const masterPlan = readTextFile("docs/implementation/huma-website-master-plan.md");
  record(
    "master plan: records a final concept decision (not still an open Phase 14 item)",
    /Final production concept.*Concept A/i.test(masterPlan) || /Confirmed final production concept:\s*Concept A/i.test(masterPlan),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    checks,
    passed: issues.length === 0,
  };

  fs.writeFileSync(path.join(phase14ValidationDir, "phase14-validation-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));

  if (issues.length > 0) {
    process.exitCode = 1;
  }
}

main();
