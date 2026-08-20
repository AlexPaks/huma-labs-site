export const approvedCapabilityIds = ["presence", "resilience", "adaptability", "leadership"];

export class ResultValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ResultValidationError";
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new ResultValidationError(message);
  }
}

function isNonEmptyString(value, maxLength = 4000) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

/**
 * The JSON Schema handed to providers that support structured/constrained output
 * (OpenAI Structured Outputs, Claude tool-forced JSON). Kept in one place so every
 * provider and the validator below describe the exact same shape.
 */
export const insightResultJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "primaryCapability",
    "secondaryCapabilities",
    "executiveSummary",
    "organizationalAnalysis",
    "possibleOrganizationalImpact",
    "signalsToExamine",
    "recommendedDirection",
    "suggestedNextStep",
    "disclaimer",
  ],
  properties: {
    primaryCapability: { type: "string", enum: approvedCapabilityIds },
    secondaryCapabilities: {
      type: "array",
      items: { type: "string", enum: approvedCapabilityIds },
      maxItems: 2,
    },
    executiveSummary: { type: "string" },
    organizationalAnalysis: { type: "string" },
    possibleOrganizationalImpact: { type: "string" },
    signalsToExamine: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 3,
    },
    recommendedDirection: {
      type: "object",
      additionalProperties: false,
      required: ["discover", "design", "act"],
      properties: {
        discover: { type: "string" },
        design: { type: "string" },
        act: { type: "string" },
      },
    },
    suggestedNextStep: { type: "string" },
    disclaimer: { type: "string" },
  },
};

/**
 * Validates and normalizes a provider's raw structured output into the
 * provider-independent InsightResult shape. Throws ResultValidationError on
 * anything that does not match — callers must classify that as
 * INVALID_PROVIDER_OUTPUT and never forward the raw value to the client.
 */
export function validateInsightResultContent(raw) {
  assert(raw && typeof raw === "object" && !Array.isArray(raw), "Provider output is not an object.");

  assert(
    typeof raw.primaryCapability === "string" && approvedCapabilityIds.includes(raw.primaryCapability),
    "Provider output has an invalid or missing primaryCapability.",
  );

  const secondaryCapabilities = Array.isArray(raw.secondaryCapabilities) ? raw.secondaryCapabilities : [];
  assert(secondaryCapabilities.length <= 2, "Provider output has more than two secondaryCapabilities.");
  for (const capabilityId of secondaryCapabilities) {
    assert(
      typeof capabilityId === "string" && approvedCapabilityIds.includes(capabilityId),
      `Provider output has an unapproved secondary capability id: ${capabilityId}`,
    );
  }
  assert(
    !secondaryCapabilities.includes(raw.primaryCapability),
    "Provider output lists the primary capability again as a secondary capability.",
  );

  assert(isNonEmptyString(raw.executiveSummary), "Provider output has an invalid executiveSummary.");
  assert(isNonEmptyString(raw.organizationalAnalysis), "Provider output has an invalid organizationalAnalysis.");
  assert(
    isNonEmptyString(raw.possibleOrganizationalImpact),
    "Provider output has an invalid possibleOrganizationalImpact.",
  );

  assert(
    Array.isArray(raw.signalsToExamine) &&
      raw.signalsToExamine.length === 3 &&
      raw.signalsToExamine.every((item) => isNonEmptyString(item, 600)),
    "Provider output must include exactly three non-empty signalsToExamine.",
  );

  const direction = raw.recommendedDirection;
  assert(
    direction &&
      typeof direction === "object" &&
      isNonEmptyString(direction.discover) &&
      isNonEmptyString(direction.design) &&
      isNonEmptyString(direction.act),
    "Provider output has an invalid recommendedDirection.",
  );

  assert(isNonEmptyString(raw.suggestedNextStep), "Provider output has an invalid suggestedNextStep.");
  assert(isNonEmptyString(raw.disclaimer), "Provider output has an invalid disclaimer.");

  return {
    primaryCapability: raw.primaryCapability,
    secondaryCapabilities,
    executiveSummary: raw.executiveSummary.trim(),
    organizationalAnalysis: raw.organizationalAnalysis.trim(),
    possibleOrganizationalImpact: raw.possibleOrganizationalImpact.trim(),
    signalsToExamine: raw.signalsToExamine.map((item) => item.trim()),
    recommendedDirection: {
      discover: direction.discover.trim(),
      design: direction.design.trim(),
      act: direction.act.trim(),
    },
    suggestedNextStep: raw.suggestedNextStep.trim(),
    disclaimer: raw.disclaimer.trim(),
  };
}

/**
 * Wraps validated provider content with the provider-independent envelope
 * fields (result id, versions, language) that never come from the model.
 */
export function buildInsightResult({ resultId, quizVersion, promptVersion, language, content }) {
  return {
    resultId,
    quizVersion,
    promptVersion,
    language,
    ...content,
  };
}
