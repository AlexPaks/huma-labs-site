export class ProviderError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = "ProviderError";
    this.code = code; // "PROVIDER_UNAVAILABLE" | "TIMEOUT" | "INVALID_PROVIDER_OUTPUT"
    this.cause = cause;
  }
}

/**
 * Shared contract every provider (mock, OpenAI, Claude) implements. The
 * endpoint only ever depends on this shape, never on a specific provider —
 * the frontend must not know which provider produced a result.
 *
 * A provider's analyze(input) must resolve to { raw } where `raw` is passed,
 * unvalidated, straight into validateInsightResultContent — providers never
 * validate their own output.
 *
 * @typedef {object} AnalyzeInput
 * @property {"he"|"en"} language
 * @property {string} prompt
 * @property {string} promptVersion
 * @property {string} quizVersion
 */
