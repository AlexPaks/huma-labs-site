import crypto from "node:crypto";
import commonMessagesHe from "../../messages/he/common.json" with { type: "json" };
import commonMessagesEn from "../../messages/en/common.json" with { type: "json" };
import {
  validateInsightDeliveryRequest,
  RequestValidationError,
  HONEYPOT_FIELD_KEY,
} from "../schemas/insight-delivery-request.schema.mjs";
import { sendTemplatedEmail } from "../email/email-service.mjs";
import { EmailError } from "../email/email-provider.mjs";
import { createRateLimiter } from "../services/rate-limiter.mjs";

const rateLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 5 });
const capabilityLabelsByLanguage = {
  he: commonMessagesHe.capabilityLabels,
  en: commonMessagesEn.capabilityLabels,
};

const SUBJECT_BY_LANGUAGE = {
  he: "HUMA Organizational Insight שלכם",
  en: "Your HUMA Organizational Insight",
};

function toCapabilityLabel(language, capabilityId) {
  return capabilityLabelsByLanguage[language]?.[capabilityId] ?? capabilityId;
}

/**
 * Framework-agnostic core handler. The recipient is always the submitter's
 * own "email" field from the validated request — there is no way for the
 * client to direct delivery to a different address.
 */
export async function handleDeliverInsightRequest({ rawBody, serializedLength, clientKey }) {
  const requestId = crypto.randomUUID();

  const rateLimitResult = rateLimiter.check(clientKey);
  if (!rateLimitResult.allowed) {
    return { status: 429, body: { requestId, error: { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." } } };
  }

  let parsed;
  try {
    parsed = validateInsightDeliveryRequest(rawBody, serializedLength);
  } catch (error) {
    if (error instanceof RequestValidationError) {
      const status = error.code === "UNSUPPORTED_FORM_VERSION" ? 409 : error.code === "REQUEST_TOO_LARGE" ? 413 : 400;
      return { status, body: { requestId, error: { code: error.code, message: error.message } } };
    }
    throw error;
  }

  if (parsed.isHoneypotTriggered) {
    console.info("[deliver-insight] honeypot triggered, discarding", requestId);
    return { status: 200, body: { requestId, status: "sent" } };
  }

  console.info("[deliver-insight] request", requestId, { hasEmail: Boolean(parsed.fields.email) });

  const language = rawBody.language;

  try {
    await sendTemplatedEmail({
      templateName: "insight-delivery",
      language,
      to: parsed.fields.email,
      subjectByLanguage: SUBJECT_BY_LANGUAGE,
      values: {
        ...parsed.fields,
        primaryCapability: toCapabilityLabel(language, parsed.insightContext.primaryCapability),
        secondaryCapabilities: parsed.insightContext.secondaryCapabilities.map((id) => toCapabilityLabel(language, id)),
      },
    });
  } catch (error) {
    const code = error instanceof EmailError ? error.code : "PROVIDER_UNAVAILABLE";
    console.error("[deliver-insight] send failed", requestId, code);
    return { status: 503, body: { requestId, error: { code, message: "The email could not be sent right now. Please try again." } } };
  }

  return { status: 200, body: { requestId, status: "sent" } };
}

export { HONEYPOT_FIELD_KEY };
