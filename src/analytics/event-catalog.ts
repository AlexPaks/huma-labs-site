import marketingEvents from "../../config/marketing-events.json";

export type ConsentCategory = "essential" | "functional" | "analytics" | "marketing";

export type EventId =
  | "page_view"
  | "language_changed"
  | "primary_cta_clicked"
  | "secondary_cta_clicked"
  | "quiz_viewed"
  | "quiz_started"
  | "quiz_step_completed"
  | "quiz_completed"
  | "insight_analysis_started"
  | "insight_analysis_completed"
  | "insight_analysis_failed"
  | "insight_result_viewed"
  | "insight_email_form_viewed"
  | "insight_email_form_started"
  | "insight_email_submitted"
  | "contact_form_viewed"
  | "contact_form_started"
  | "contact_form_submitted"
  | "contact_form_failed"
  | "consent_banner_viewed"
  | "consent_preferences_saved"
  | "consent_withdrawn";

export type EventPayload = Record<string, string | number | boolean>;

interface EventCatalogEntry {
  id: EventId;
  sendToCategories: ConsentCategory[];
}

const catalog = (marketingEvents as { events: EventCatalogEntry[] }).events;
export const eventCatalogById = Object.fromEntries(catalog.map((entry) => [entry.id, entry])) as Record<
  EventId,
  EventCatalogEntry
>;

/**
 * Payload keys that must never appear in a marketing/analytics event,
 * per the master plan's prohibited-payload rule. This is a defense-in-depth
 * guard inside the analytics service itself, not just a documentation note —
 * a payload containing any of these keys is rejected before it ever reaches
 * a provider.
 */
const PROHIBITED_PAYLOAD_KEYS = new Set([
  "name",
  "fullName",
  "email",
  "telephone",
  "phone",
  "organization",
  "organizationName",
  "challenge",
  "answers",
  "answer",
  "prompt",
  "llmResult",
  "result",
  "emailBody",
  "apiKey",
  "credentials",
  "stack",
  "stackTrace",
  "rawError",
  "error",
]);

export function assertSafeEventPayload(eventId: EventId, payload: EventPayload | undefined): void {
  if (!payload) {
    return;
  }

  for (const key of Object.keys(payload)) {
    if (PROHIBITED_PAYLOAD_KEYS.has(key)) {
      throw new Error(`Analytics event "${eventId}" attempted to send a prohibited payload key: "${key}"`);
    }
  }
}
