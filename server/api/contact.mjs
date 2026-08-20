import crypto from "node:crypto";
import { validateContactRequest, RequestValidationError, HONEYPOT_FIELD_KEY } from "../schemas/contact-request.schema.mjs";
import { sendTemplatedEmail } from "../email/email-service.mjs";
import { EmailError } from "../email/email-provider.mjs";
import { createRateLimiter } from "../services/rate-limiter.mjs";

const rateLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 5 });

const SUBJECT_BY_LANGUAGE = {
  he: "פנייה חדשה מאתר HUMA Labs",
  en: "New contact submission from HUMA Labs",
};

function toLoggableSummary(fields) {
  return {
    hasFullName: Boolean(fields.fullName),
    hasEmail: Boolean(fields.email),
    focusAreaCount: Array.isArray(fields.focusAreas) ? fields.focusAreas.length : 0,
  };
}

/**
 * Framework-agnostic core handler — see server/api/analyze-assessment.mjs
 * for the same pattern. The recipient is always the internal notification
 * address from server configuration; the client never supplies it.
 */
export async function handleContactRequest({ rawBody, serializedLength, clientKey }) {
  const requestId = crypto.randomUUID();

  const rateLimitResult = rateLimiter.check(clientKey);
  if (!rateLimitResult.allowed) {
    return { status: 429, body: { requestId, error: { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." } } };
  }

  let parsed;
  try {
    parsed = validateContactRequest(rawBody, serializedLength);
  } catch (error) {
    if (error instanceof RequestValidationError) {
      const status = error.code === "UNSUPPORTED_FORM_VERSION" ? 409 : error.code === "REQUEST_TOO_LARGE" ? 413 : 400;
      return { status, body: { requestId, error: { code: error.code, message: error.message } } };
    }
    throw error;
  }

  // Honeypot triggered: respond with a normal-looking success but never
  // actually send anything, and never reveal that detection happened.
  if (parsed.isHoneypotTriggered) {
    console.info("[contact] honeypot triggered, discarding", requestId);
    return { status: 200, body: { requestId, status: "sent" } };
  }

  console.info("[contact] request", requestId, toLoggableSummary(parsed.fields));

  const notificationAddress = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!notificationAddress) {
    console.error("[contact] CONTACT_NOTIFICATION_EMAIL is not configured", requestId);
    return { status: 503, body: { requestId, error: { code: "PROVIDER_UNAVAILABLE", message: "Contact delivery is not available right now." } } };
  }

  try {
    await sendTemplatedEmail({
      templateName: "contact-notification",
      language: rawBody.language,
      to: notificationAddress,
      replyTo: parsed.fields.email || undefined,
      subjectByLanguage: SUBJECT_BY_LANGUAGE,
      values: {
        ...parsed.fields,
        focusAreas: Array.isArray(parsed.fields.focusAreas)
          ? parsed.fields.focusAreas
          : [],
      },
    });
  } catch (error) {
    const code = error instanceof EmailError ? error.code : "PROVIDER_UNAVAILABLE";
    console.error("[contact] send failed", requestId, code);
    return { status: 503, body: { requestId, error: { code, message: "The message could not be sent right now. Please try again." } } };
  }

  return { status: 200, body: { requestId, status: "sent" } };
}

export { HONEYPOT_FIELD_KEY };
