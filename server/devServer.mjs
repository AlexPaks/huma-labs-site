// Local-only development server for exercising the API endpoints without a
// Vercel deployment. Not used in production — Phase 16 (Vercel Deployment)
// will decide the real hosting adapter. Run with:
//   node --env-file=.env.local server/devServer.mjs
// (the --env-file flag is optional; omit it to run with LLM_PROVIDER=mock,
// EMAIL_PROVIDER=mock, and no other env vars, which is the safe default.)
import http from "node:http";
import { handleAnalyzeAssessment, REQUEST_JSON_MAX_BYTES } from "./api/analyze-assessment.mjs";
import { handleContactRequest } from "./api/contact.mjs";
import { handleDeliverInsightRequest } from "./api/deliver-insight.mjs";

const PORT = Number(process.env.PORT) || 8787;
const MAX_BODY_BYTES = 30_000;

const routes = {
  "/api/organizational-insight/analyze": (rawBody, serializedLength, clientKey) =>
    handleAnalyzeAssessment({ rawBody, serializedLength, clientKey }),
  "/api/contact": (rawBody, serializedLength, clientKey) =>
    handleContactRequest({ rawBody, serializedLength, clientKey }),
  "/api/insight/deliver": (rawBody, serializedLength, clientKey) =>
    handleDeliverInsightRequest({ rawBody, serializedLength, clientKey }),
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let totalBytes = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Request body too large"), { code: "REQUEST_TOO_LARGE" }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const handler = req.method === "POST" ? routes[req.url] : null;

  if (!handler) {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        error: { code: "NOT_FOUND", message: `Only POST ${Object.keys(routes).join(", ")} are available on this dev server.` },
      }),
    );
    return;
  }

  let bodyBuffer;
  try {
    bodyBuffer = await readBody(req);
  } catch {
    res.writeHead(413, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: { code: "REQUEST_TOO_LARGE", message: "Request body is too large." } }));
    return;
  }

  let rawBody;
  try {
    rawBody = JSON.parse(bodyBuffer.toString("utf8") || "{}");
  } catch {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: { code: "INVALID_REQUEST", message: "Request body must be valid JSON." } }));
    return;
  }

  const clientKey = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").toString();

  try {
    const { status, body } = await handler(rawBody, bodyBuffer.length, clientKey);
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  } catch (error) {
    console.error("[devServer] unexpected error", error);
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: { code: "INTERNAL_ERROR", message: "Unexpected server error." } }));
  }
});

server.listen(PORT, () => {
  console.log(`[devServer] listening on http://127.0.0.1:${PORT}`);
  console.log(`[devServer] routes: ${Object.keys(routes).join(", ")}`);
  console.log(`[devServer] LLM_PROVIDER=${process.env.LLM_PROVIDER || "mock"}`);
  console.log(`[devServer] EMAIL_PROVIDER=${process.env.EMAIL_PROVIDER || "mock"}`);
});
