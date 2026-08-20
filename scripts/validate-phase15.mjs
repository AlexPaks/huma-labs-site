import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const phase15ValidationDir = path.join(root, "docs", "implementation", "validation", "phase-15");
const EXPECTED_REMOTE = "https://github.com/AlexPaks/huma-labs-site";

function readTextFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function git(args) {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  } catch (error) {
    return null;
  }
}

function main() {
  ensureDirectory(phase15ValidationDir);
  const issues = [];
  const checks = [];

  function record(name, passed, detail) {
    checks.push({ name, passed, detail: detail ?? null });
    if (!passed) issues.push(name);
  }

  record("git: repository is initialized (.git exists)", fs.existsSync(path.join(root, ".git")));

  const currentBranch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
  record("git: current branch is main", currentBranch === "main", `branch=${currentBranch}`);

  const commitCount = git(["rev-list", "--count", "HEAD"]);
  record("git: at least one commit exists on main", Boolean(commitCount) && Number(commitCount) >= 1, `commitCount=${commitCount}`);

  const remoteUrl = git(["remote", "get-url", "origin"]);
  record(
    "git: origin remote points at the confirmed GitHub repository",
    remoteUrl === EXPECTED_REMOTE || remoteUrl === `${EXPECTED_REMOTE}.git`,
    `remoteUrl=${remoteUrl}`,
  );

  const workingTreeStatus = git(["status", "--porcelain"]);
  record("git: working tree is clean (no uncommitted changes)", workingTreeStatus === "", `status=${JSON.stringify(workingTreeStatus)}`);

  // .gitignore regression guards — must never accidentally track secrets,
  // dependencies, or build output.
  const gitignore = readTextFile(".gitignore");
  for (const pattern of ["node_modules/", "dist/", ".env", "*.tsbuildinfo", ".claude/"]) {
    record(`.gitignore: excludes ${pattern}`, gitignore.includes(pattern));
  }

  const trackedFiles = (git(["ls-files"]) ?? "").split("\n").filter(Boolean);
  record("git: no node_modules/dist/.env files are tracked", !trackedFiles.some((f) => /^(node_modules\/|dist\/)|(^|\/)\.env($|\.)/.test(f) && !f.endsWith(".env.example")));
  record("git: .claude/ local tooling settings are not tracked", !trackedFiles.some((f) => f.startsWith(".claude/")));
  record("git: package-lock.json is tracked (reproducible installs)", trackedFiles.includes("package-lock.json"));

  record("README.md exists for GitHub publication", fileExists("README.md"));

  const report = {
    generatedAt: new Date().toISOString(),
    checks,
    passed: issues.length === 0,
    note: "Actual `git push` to the remote is a manual step performed by the user in their own interactive terminal (Windows Credential Manager requires an interactive prompt this tool's non-interactive shell cannot provide). This validator checks the local repository state is ready to publish, not that publication has completed.",
  };

  fs.writeFileSync(path.join(phase15ValidationDir, "phase15-validation-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));

  if (issues.length > 0) {
    process.exitCode = 1;
  }
}

main();
