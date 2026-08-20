import type { InsightCompletionPayload } from "./insightEngine";
import type { InsightResult } from "./insightResultTypes";

export type InsightAnalysisOutcome =
  | { ok: true; result: InsightResult }
  | { ok: false; code: string };

/**
 * Calls the Phase 8 secure endpoint. The browser never talks to OpenAI or
 * Claude directly and never sees which provider produced the result — it
 * only ever sees this same-origin call and a classified error code on
 * failure, never a raw provider error or stack trace.
 */
export async function requestInsightAnalysis(
  payload: InsightCompletionPayload,
): Promise<InsightAnalysisOutcome> {
  try {
    const response = await fetch("/api/organizational-insight/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        quizId: payload.quizId,
        quizVersion: payload.quizVersion,
        language: payload.language,
        answers: payload.answers,
      }),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok || !body?.result) {
      return { ok: false, code: body?.error?.code ?? "PROVIDER_UNAVAILABLE" };
    }

    return { ok: true, result: body.result as InsightResult };
  } catch {
    return { ok: false, code: "NETWORK_ERROR" };
  }
}
