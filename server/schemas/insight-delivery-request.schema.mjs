import insightEmailFormDefinition from "../../forms/insight-email-form.json" with { type: "json" };
import { approvedCapabilityIds } from "./insight-result.schema.mjs";

export const HONEYPOT_FIELD_KEY = "website";
const FIELD_TEXT_MAX_LENGTH = 200;
const supportedLanguages = new Set(["he", "en"]);

export class RequestValidationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "RequestValidationError";
    this.code = code;
  }
}

function assert(condition, code, message) {
  if (!condition) {
    throw new RequestValidationError(code, message);
  }
}

/**
 * Validates an insight-delivery request. The recipient is always the
 * submitter's own "email" field — there is no separate recipient parameter,
 * so the client can never direct delivery to an arbitrary third-party
 * address. insightContext only accepts the already-approved structured
 * capability ids, never free-form narrative text.
 */
export function validateInsightDeliveryRequest(rawBody, serializedLength) {
  assert(typeof serializedLength === "number" && serializedLength <= 10_000, "REQUEST_TOO_LARGE", "Request body is too large.");
  assert(rawBody && typeof rawBody === "object" && !Array.isArray(rawBody), "INVALID_REQUEST", "Request body must be a JSON object.");
  assert(rawBody.formId === insightEmailFormDefinition.formId, "INVALID_REQUEST", "Unknown formId.");
  assert(rawBody.formVersion === insightEmailFormDefinition.version, "UNSUPPORTED_FORM_VERSION", "Unsupported form version.");
  assert(typeof rawBody.language === "string" && supportedLanguages.has(rawBody.language), "INVALID_REQUEST", "Unsupported or missing language.");
  assert(rawBody.fields && typeof rawBody.fields === "object" && !Array.isArray(rawBody.fields), "INVALID_REQUEST", "Missing fields object.");

  const allowedTopLevelKeys = new Set(["formId", "formVersion", "language", "fields", "insightContext"]);
  for (const key of Object.keys(rawBody)) {
    assert(allowedTopLevelKeys.has(key), "INVALID_REQUEST", `Unexpected top-level field: ${key}`);
  }

  const isHoneypotTriggered = typeof rawBody.fields[HONEYPOT_FIELD_KEY] === "string" && rawBody.fields[HONEYPOT_FIELD_KEY].trim().length > 0;

  const allowedKeys = new Set([...insightEmailFormDefinition.fields.map((field) => field.id), HONEYPOT_FIELD_KEY]);
  for (const key of Object.keys(rawBody.fields)) {
    assert(allowedKeys.has(key), "INVALID_REQUEST", `Unexpected field: ${key}`);
  }

  const fields = {};

  for (const field of insightEmailFormDefinition.fields) {
    const value = rawBody.fields[field.id];
    const text = typeof value === "string" ? value : "";
    assert(text.length <= FIELD_TEXT_MAX_LENGTH, "INVALID_REQUEST", `Field "${field.id}" exceeds the ${FIELD_TEXT_MAX_LENGTH}-character limit.`);
    assert(!field.required || text.trim().length > 0, "INVALID_REQUEST", `Field "${field.id}" is required.`);

    if (field.type === "email") {
      assert(text.trim().length > 0, "INVALID_REQUEST", "An email address is required to deliver the insight.");
      assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text), "INVALID_REQUEST", "Invalid email address.");
    }

    fields[field.id] = text;
  }

  const insightContext = rawBody.insightContext;
  assert(
    insightContext && typeof insightContext === "object" && approvedCapabilityIds.includes(insightContext.primaryCapability),
    "INVALID_REQUEST",
    "Missing or invalid insightContext.primaryCapability.",
  );

  const secondaryCapabilities = Array.isArray(insightContext.secondaryCapabilities) ? insightContext.secondaryCapabilities : [];
  assert(secondaryCapabilities.length <= 2, "INVALID_REQUEST", "insightContext.secondaryCapabilities may contain at most two entries.");
  for (const capabilityId of secondaryCapabilities) {
    assert(approvedCapabilityIds.includes(capabilityId), "INVALID_REQUEST", `Unapproved capability id: ${capabilityId}`);
  }

  return {
    fields,
    isHoneypotTriggered,
    insightContext: {
      primaryCapability: insightContext.primaryCapability,
      secondaryCapabilities,
    },
  };
}
