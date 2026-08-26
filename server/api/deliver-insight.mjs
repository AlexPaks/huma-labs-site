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
  he: "התובנה הארגונית שלכם מ-HUMA",
  en: "Your HUMA Insight",
};

const INTERNAL_SUBJECT_BY_LANGUAGE = {
  he: "תובנה ארגונית חדשה של HUMA",
  en: "New HUMA Insight submission",
};

function toCapabilityLabel(language, capabilityId) {
  return capabilityLabelsByLanguage[language]?.[capabilityId] ?? capabilityId;
}

function toBulletedList(items) {
  return Array.isArray(items) && items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : "";
}

function toInsightEmailValues(insightResult) {
  if (!insightResult) {
    return {};
  }

  return {
    executiveSummary: insightResult.executiveSummary,
    organizationalAnalysis: insightResult.organizationalAnalysis,
    possibleOrganizationalImpact: insightResult.possibleOrganizationalImpact,
    signalsToExamine: toBulletedList(insightResult.signalsToExamine),
    discoverDirection: insightResult.recommendedDirection.discover,
    designDirection: insightResult.recommendedDirection.design,
    actDirection: insightResult.recommendedDirection.act,
    suggestedNextStep: insightResult.suggestedNextStep,
    disclaimer: insightResult.disclaimer,
  };
}

function getInsightNotificationAddress() {
  return process.env.INSIGHT_NOTIFICATION_EMAIL?.trim() || process.env.CONTACT_NOTIFICATION_EMAIL?.trim() || null;
}

function toSafeEmailFailureMetadata(error) {
  const cause = error instanceof EmailError ? error.cause : undefined;

  return {
    provider: process.env.EMAIL_PROVIDER?.trim() || "mock",
    hasBrevoApiKey: Boolean(process.env.BREVO_API_KEY),
    hasBrevoFromEmail: Boolean(process.env.BREVO_FROM_EMAIL?.trim()),
    brevoFromName: process.env.BREVO_FROM_NAME?.trim() || "HUMA Labs",
    brevoFromAddress: process.env.BREVO_FROM_EMAIL?.trim() || null,
    brevoSandbox: process.env.BREVO_SANDBOX !== "false",
    code: error instanceof EmailError ? error.code : "UNEXPECTED_ERROR",
    reason: error instanceof EmailError ? error.message : null,
    status: Number.isInteger(cause?.status) ? cause.status : null,
    errorName: typeof cause?.name === "string" ? cause.name : null,
    networkCode: typeof cause?.cause?.code === "string" ? cause.cause.code : null,
  };
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
  const notificationAddress = getInsightNotificationAddress();

  if (!notificationAddress) {
    console.error("[deliver-insight] HUMA notification address is not configured", requestId);
    return { status: 503, body: { requestId, error: { code: "PROVIDER_UNAVAILABLE", message: "Insight delivery is not available right now. Please try again." } } };
  }

  const insightValues = {
    ...parsed.fields,
    primaryCapability: toCapabilityLabel(language, parsed.insightContext.primaryCapability),
    secondaryCapabilities: parsed.insightContext.secondaryCapabilities.map((id) => toCapabilityLabel(language, id)),
    ...toInsightEmailValues(parsed.insightResult),
  };

  try {
    await sendTemplatedEmail({
      templateName: "insight-notification",
      language,
      to: notificationAddress,
      replyTo: parsed.fields.email,
      subjectByLanguage: INTERNAL_SUBJECT_BY_LANGUAGE,
      values: insightValues,
    });

    await sendTemplatedEmail({
      templateName: "insight-delivery",
      language,
      to: parsed.fields.email,
      subjectByLanguage: SUBJECT_BY_LANGUAGE,
      values: insightValues,
    });
  } catch (error) {
    const code = error instanceof EmailError ? error.code : "PROVIDER_UNAVAILABLE";
    console.error("[deliver-insight] send failed", requestId, toSafeEmailFailureMetadata(error));
    return { status: 503, body: { requestId, error: { code, message: "The email could not be sent right now. Please try again." } } };
  }

  return { status: 200, body: { requestId, status: "sent" } };
}

export { HONEYPOT_FIELD_KEY };
