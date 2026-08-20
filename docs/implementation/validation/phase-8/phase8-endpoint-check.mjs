// Exercises the local dev server (server/devServer.mjs) over real HTTP to
// prove the endpoint end-to-end, separately from the in-process checks in
// scripts/validate-phase8.mjs. Requires the dev server to already be
// running on PORT (default 8787) with LLM_PROVIDER=mock.
import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.HUMA_SERVER_URL || "http://127.0.0.1:8787";
const outputDir = path.join(process.cwd(), "docs", "implementation", "validation", "phase-8");

const validRequestBody = {
  quizId: "organizational-insight",
  quizVersion: "1.0.0",
  language: "he",
  answers: [
    { questionId: "challenge", value: "coping-with-change" },
    { questionId: "impact", value: "decision-making" },
    { questionId: "desired-change", value: "confident-employees" },
    { questionId: "audience", value: "leadership" },
    { questionId: "current-state", value: "know-problem-and-goal" },
    { questionId: "tomorrow-problem", value: "בדיקת Phase 8 - תשובה לדוגמה" },
  ],
};

async function post(body) {
  const response = await fetch(`${baseUrl}/api/organizational-insight/analyze`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}

async function main() {
  const report = {};

  report.validRequest = await post(validRequestBody);
  report.unsupportedQuizVersion = await post({ ...validRequestBody, quizVersion: "9.9.9" });
  report.unexpectedField = await post({ ...validRequestBody, utmSource: "campaign" });
  report.overLengthAnswer = await post({
    ...validRequestBody,
    answers: [{ questionId: "tomorrow-problem", value: "a".repeat(3000) }],
  });

  const rapidResults = [];
  for (let i = 0; i < 12; i += 1) {
    const result = await post(validRequestBody);
    rapidResults.push(result.status);
  }
  report.rateLimitStatusSequence = rapidResults;

  fs.writeFileSync(path.join(outputDir, "phase8-endpoint-check.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
