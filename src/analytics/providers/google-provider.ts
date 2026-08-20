import analyticsConfig from "../../../config/analytics.json";
import type { AnalyticsProvider } from "../analytics-provider";
import type { EventId, EventPayload } from "../event-catalog";
import { loadExternalScript } from "../tag-loader";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const config = analyticsConfig.providers.google;
let initialized = false;

/**
 * Real Google (GTM/GA4) provider. Never activates on its own: init() is a
 * no-op unless the provider is explicitly enabled AND a real container/
 * measurement id is configured in config/analytics.json — neither is true
 * by default, so no Google script is ever injected and no gtag call is
 * ever made until that changes with explicit approval.
 */
export const googleProvider: AnalyticsProvider = {
  id: "google",
  requiresConsentCategory: "analytics",
  init() {
    if (initialized || !config.enabled || (!config.gtmContainerId && !config.ga4MeasurementId)) {
      return;
    }

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = window.gtag ?? ((...args: unknown[]) => window.dataLayer!.push(args));
    window.gtag("js", new Date());

    if (config.ga4MeasurementId) {
      window.gtag("config", config.ga4MeasurementId);
      loadExternalScript(`https://www.googletagmanager.com/gtag/js?id=${config.ga4MeasurementId}`);
    }

    if (config.gtmContainerId) {
      loadExternalScript(`https://www.googletagmanager.com/gtm.js?id=${config.gtmContainerId}`);
    }

    initialized = true;
  },
  track(eventId: EventId, payload: EventPayload | undefined) {
    if (!initialized || typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", eventId, payload ?? {});
  },
};
