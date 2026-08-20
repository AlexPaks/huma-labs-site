import { validateInsightResultContent } from "../schemas/insight-result.schema.mjs";
import { ProviderError } from "../providers/llm-provider.mjs";

/**
 * Validates a provider's raw output through the shared schema and
 * reclassifies any shape failure as a provider-layer error, so the endpoint
 * has one consistent error-code vocabulary regardless of which provider
 * produced (or failed to produce) the result.
 */
export function validateProviderOutput(raw) {
  try {
    return validateInsightResultContent(raw);
  } catch (error) {
    throw new ProviderError("INVALID_PROVIDER_OUTPUT", error.message, error);
  }
}
