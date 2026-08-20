import analyticsConfig from "../../config/analytics.json";
import type { AnalyticsProvider } from "./analytics-provider";
import { assertSafeEventPayload, eventCatalogById, type EventId, type EventPayload } from "./event-catalog";
import { mockAnalyticsProvider } from "./providers/mock-analytics-provider";
import { googleProvider } from "./providers/google-provider";
import { metaProvider } from "./providers/meta-provider";
import { tiktokProvider } from "./providers/tiktok-provider";
import type { ConsentState } from "./consent-service";

const allProviders: AnalyticsProvider[] = [mockAnalyticsProvider, googleProvider, metaProvider, tiktokProvider];
const enabledProviderIds = new Set(
  Object.entries(analyticsConfig.providers)
    .filter(([, providerConfig]) => providerConfig.enabled)
    .map(([id]) => id),
);

function isDebugEnabled() {
  return analyticsConfig.debug === true;
}

/**
 * The single module business components are allowed to call. No component
 * outside src/analytics/ may import a provider directly or reference
 * window.gtag/dataLayer/fbq/ttq.
 */
export const analyticsService = {
  /**
   * Initializes every enabled provider whose required consent category is
   * currently granted. Safe to call repeatedly (e.g. on every consent
   * change) — each provider's own init() guards against re-initializing.
   */
  applyConsent(consent: ConsentState) {
    for (const provider of allProviders) {
      if (!enabledProviderIds.has(provider.id)) {
        continue;
      }

      const category = provider.requiresConsentCategory;
      const granted = category === null || consent[category] === true;

      if (granted) {
        provider.init();
      }
    }
  },

  track(eventId: EventId, payload?: EventPayload, consent?: ConsentState) {
    try {
      assertSafeEventPayload(eventId, payload);
    } catch (error) {
      console.error("[analytics-service]", (error as Error).message);
      return;
    }

    const catalogEntry = eventCatalogById[eventId];
    if (!catalogEntry) {
      if (isDebugEnabled()) {
        console.warn(`[analytics-service] Unknown event id "${eventId}" — not in the event catalog.`);
      }
      return;
    }

    for (const provider of allProviders) {
      if (provider.id !== "mock" && !enabledProviderIds.has(provider.id)) {
        continue;
      }

      const category = provider.requiresConsentCategory;
      const eligibleForEvent = category === null || catalogEntry.sendToCategories.includes(category);
      const consentGranted = category === null || (consent ? consent[category] === true : false);

      if (eligibleForEvent && consentGranted) {
        provider.track(eventId, payload);
      }
    }
  },
};
