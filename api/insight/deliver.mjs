// Vercel Node serverless function adapter. Deployed at
// POST /api/insight/deliver once Phase 16 (deployment) is approved — inert
// until then. Real logic lives in server/api/deliver-insight.mjs.
import { handleDeliverInsightRequest } from "../../server/api/deliver-insight.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: { code: "METHOD_NOT_ALLOWED", message: "Use POST." } });
    return;
  }

  const clientKey = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").toString();
  const serializedLength = Buffer.byteLength(JSON.stringify(req.body ?? {}), "utf8");

  const { status, body } = await handleDeliverInsightRequest({ rawBody: req.body, serializedLength, clientKey });
  res.status(status).json(body);
}
