import contactFormDefinition from "../../forms/contact-form.json" with { type: "json" };

export const HONEYPOT_FIELD_KEY = "website";
const FIELD_TEXT_MAX_LENGTH = 200;
const TEXTAREA_MAX_LENGTH = 1000;
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

const fieldsById = Object.fromEntries(contactFormDefinition.fields.map((field) => [field.id, field]));

/**
 * Validates a contact-form submission against the real, versioned form
 * definition. Returns { fields, isHoneypotTriggered } — callers must check
 * isHoneypotTriggered and respond with a fake success without actually
 * sending anything when it is true.
 */
export function validateContactRequest(rawBody, serializedLength) {
  assert(typeof serializedLength === "number" && serializedLength <= 10_000, "REQUEST_TOO_LARGE", "Request body is too large.");
  assert(rawBody && typeof rawBody === "object" && !Array.isArray(rawBody), "INVALID_REQUEST", "Request body must be a JSON object.");
  assert(rawBody.formId === contactFormDefinition.formId, "INVALID_REQUEST", "Unknown formId.");
  assert(rawBody.formVersion === contactFormDefinition.version, "UNSUPPORTED_FORM_VERSION", "Unsupported form version.");
  assert(typeof rawBody.language === "string" && supportedLanguages.has(rawBody.language), "INVALID_REQUEST", "Unsupported or missing language.");
  assert(rawBody.fields && typeof rawBody.fields === "object" && !Array.isArray(rawBody.fields), "INVALID_REQUEST", "Missing fields object.");

  const allowedTopLevelKeys = new Set(["formId", "formVersion", "language", "fields"]);
  for (const key of Object.keys(rawBody)) {
    assert(allowedTopLevelKeys.has(key), "INVALID_REQUEST", `Unexpected top-level field: ${key}`);
  }

  const isHoneypotTriggered = typeof rawBody.fields[HONEYPOT_FIELD_KEY] === "string" && rawBody.fields[HONEYPOT_FIELD_KEY].trim().length > 0;

  const allowedKeys = new Set([...contactFormDefinition.fields.map((field) => field.id), HONEYPOT_FIELD_KEY]);
  for (const key of Object.keys(rawBody.fields)) {
    assert(allowedKeys.has(key), "INVALID_REQUEST", `Unexpected field: ${key}`);
  }

  const fields = {};

  for (const field of contactFormDefinition.fields) {
    const value = rawBody.fields[field.id];

    if (field.type === "multi-select") {
      const values = Array.isArray(value) ? value : [];
      const optionIds = new Set((field.options ?? []).map((option) => option.id));
      for (const optionId of values) {
        assert(optionIds.has(optionId), "INVALID_REQUEST", `Unknown option id "${optionId}" for field "${field.id}".`);
      }
      fields[field.id] = values;
      continue;
    }

    const text = typeof value === "string" ? value : "";
    const maxLength = field.type === "textarea" ? TEXTAREA_MAX_LENGTH : FIELD_TEXT_MAX_LENGTH;
    assert(text.length <= maxLength, "INVALID_REQUEST", `Field "${field.id}" exceeds the ${maxLength}-character limit.`);
    assert(!field.required || text.trim().length > 0, "INVALID_REQUEST", `Field "${field.id}" is required.`);

    if (field.type === "email" && text.length > 0) {
      assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text), "INVALID_REQUEST", "Invalid email address.");
    }

    fields[field.id] = text;
  }

  return { fields, isHoneypotTriggered };
}
