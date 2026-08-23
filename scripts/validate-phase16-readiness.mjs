import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const outputDirectory = path.join(root, "docs", "implementation", "validation", "phase-16-readiness");
const requiredFunctions = [
  "api/contact.mjs",
  "api/insight/deliver.mjs",
  "api/organizational-insight/analyze.mjs",
];
const requiredProductionVariables = [
  "LLM_PROVIDER",
  "OPENAI_API_KEY",
  "OPENAI_MODEL",
  "EMAIL_PROVIDER",
  "BREVO_API_KEY",
  "BREVO_FROM_EMAIL",
  "BREVO_FROM_NAME",
  "BREVO_SANDBOX",
  "CONTACT_NOTIFICATION_EMAIL",
];
const sensitiveVariables = ["OPENAI_API_KEY", "BREVO_API_KEY"];

function parseEnvironmentFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2]]),
  );
}

function runCommand(command, args) {
  return spawnSync(command, args, { cwd: root, encoding: "utf8", shell: false });
}

fs.mkdirSync(outputDirectory, { recursive: true });

const checks = [];
const blockers = [];
const record = (name, passed, detail) => checks.push({ name, passed, detail: detail ?? null });
const envExample = parseEnvironmentFile(path.join(root, ".env.example"));
const localEnvironment = parseEnvironmentFile(path.join(root, ".env.local"));
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const seoConfig = JSON.parse(fs.readFileSync(path.join(root, "config", "seo.json"), "utf8"));
const vercelConfig = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));

for (const functionPath of requiredFunctions) {
  record(`Vercel function exists: ${functionPath}`, fs.existsSync(path.join(root, functionPath)));
}

record("Production build script is configured", Boolean(packageJson.scripts?.build));
record("Vercel SPA rewrite is configured", vercelConfig.rewrites?.some((rewrite) => rewrite.source === "/(.*)"));
record(".env.example contains no secret values", sensitiveVariables.every((key) => !envExample[key]));
record(
  ".env.local is gitignored",
  fs.readFileSync(path.join(root, ".gitignore"), "utf8").split(/\r?\n/).includes(".env.*"),
);
record(
  "Required local variable names are configured",
  requiredProductionVariables.every((key) => Boolean(localEnvironment[key])),
  requiredProductionVariables.filter((key) => !localEnvironment[key]),
);

const projectLinked = fs.existsSync(path.join(root, ".vercel", "project.json"));
record("Vercel project is linked", projectLinked);
if (!projectLinked) {
  blockers.push("Link the repository to the intended Vercel project during Phase 16.");
}

const vercelVersion = runCommand("vercel.cmd", ["--version"]);
const vercelCliAvailable = vercelVersion.status === 0;
record("Vercel CLI is available", vercelCliAvailable);
if (!vercelCliAvailable) {
  blockers.push("Install or invoke a pinned Vercel CLI during Phase 16; no CLI was installed in readiness work.");
}

if (String(seoConfig.baseUrl).includes(".example")) {
  blockers.push("Replace the placeholder SEO base URL with the approved production domain and regenerate SEO files.");
}

blockers.push("Rotate the exposed OpenAI and Brevo credentials before any external validation or deployment.");
blockers.push("Configure the rotated credentials as sensitive Vercel environment variables for Production and approved Preview scopes.");

if (localEnvironment.BREVO_SANDBOX !== "false") {
  blockers.push("Decide when to switch BREVO_SANDBOX from true to false for production transactional delivery.");
}

const gitStatus = runCommand("git", ["-c", `safe.directory=${root.replaceAll("\\", "/")}`, "status", "--porcelain"]);
const pendingWorkingTreeFiles = gitStatus.status === 0
  ? gitStatus.stdout.split(/\r?\n/).filter(Boolean).length
  : null;
if (pendingWorkingTreeFiles !== 0) {
  blockers.push("Review, approve, commit, and push the Phase 15.6 working tree before a Git-integrated deployment.");
}

blockers.push("Create and verify a Vercel Preview deployment before any production promotion.");
blockers.push("Run post-preview browser, API, OpenAI, Brevo, SEO, and error-log verification before production approval.");

const nonBlockingCheckNames = ["Vercel project is linked", "Vercel CLI is available"];
const report = {
  generatedAt: new Date().toISOString(),
  phase16Status: "NOT STARTED",
  auditCompleted: true,
  staticReadinessChecksPassed: checks.every((check) => check.passed || nonBlockingCheckNames.includes(check.name)),
  readyForPhase16Execution: false,
  sensitiveValuesRecorded: false,
  localConfiguration: {
    configuredRequiredVariableCount: requiredProductionVariables.filter((key) => Boolean(localEnvironment[key])).length,
    requiredVariableCount: requiredProductionVariables.length,
    brevoSandboxEnabled: localEnvironment.BREVO_SANDBOX !== "false",
  },
  repository: {
    pendingWorkingTreeFiles,
    vercelProjectLinked: projectLinked,
    vercelCliAvailable,
  },
  checks,
  blockers,
};

fs.writeFileSync(
  path.join(outputDirectory, "phase16-readiness-report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));

if (!report.staticReadinessChecksPassed) {
  process.exitCode = 1;
}
