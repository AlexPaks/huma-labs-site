import type { AnalyticsProvider } from "../analytics-provider";
import type { EventId, EventPayload } from "../event-catalog";

/**
 * Default provider. Logs to the console only (in debug mode) — no network
 * request, no script injection. Safe to run with no configuration at all.
 */
export const mockAnalyticsProvider: AnalyticsProvider = {
  id: "mock",
  requiresConsentCategory: null,
  init() {
    // Nothing to load — intentionally inert.
  },
  track(eventId: EventId, payload: EventPayload | undefined) {
    console.info("[mock-analytics-provider]", eventId, payload ?? {});
  },
};
