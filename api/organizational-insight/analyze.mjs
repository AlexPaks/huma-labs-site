// Vercel Node serverless function adapter. Deployed at
// POST /api/organizational-insight/analyze once Phase 16 (deployment) is
// approved — this file is not invoked by anything until then. All real
// logic lives in server/api/analyze-assessment.mjs so the same handler is
// exercised by the local dev server used for Phase 8 verification.
import { handleAnalyzeAssessment, REQUEST_JSON_MAX_BYTES } from "../../server/api/analyze-assessment.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: { code: "METHOD_NOT_ALLOWED", message: "Use POST." } });
    return;
  }

  const clientKey = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").toString();
  const serializedLength = Buffer.byteLength(JSON.stringify(req.body ?? {}), "utf8");

  if (serializedLength > REQUEST_JSON_MAX_BYTES) {
    res.status(413).json({ error: { code: "REQUEST_TOO_LARGE", message: "Request body is too large." } });
    return;
  }

  const { status, body } = await handleAnalyzeAssessment({ rawBody: req.body, serializedLength, clientKey });
  res.status(status).json(body);
}
