import type { ConsentCategory, EventId, EventPayload } from "./event-catalog";

/**
 * Shared contract every analytics provider (mock, Google, Meta, TikTok)
 * implements. analytics-service.ts is the only module that talks to
 * providers directly — business components must never import or call a
 * provider (or a raw gtag/dataLayer/fbq/ttq) themselves.
 */
export interface AnalyticsProvider {
  readonly id: string;
  readonly requiresConsentCategory: ConsentCategory | null;
  /** Called once, only after its required consent category (if any) is granted. */
  init(): void;
  track(eventId: EventId, payload: EventPayload | undefined): void;
}
