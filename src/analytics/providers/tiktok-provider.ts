import analyticsConfig from "../../../config/analytics.json";
import type { AnalyticsProvider } from "../analytics-provider";
import type { EventId, EventPayload } from "../event-catalog";
import { loadExternalScript } from "../tag-loader";

declare global {
  interface Window {
    ttq?: {
      track: (...args: unknown[]) => void;
      load: (pixelId: string) => void;
      page: () => void;
    };
  }
}

const config = analyticsConfig.providers.tiktok;
let initialized = false;

/**
 * Real TikTok Pixel provider. Never activates on its own: init() is a
 * no-op unless the provider is explicitly enabled AND a real pixel id is
 * configured — neither is true by default, so the TikTok Pixel script is
 * never injected and ttq is never called until that changes with explicit
 * marketing consent AND approval.
 */
export const tiktokProvider: AnalyticsProvider = {
  id: "tiktok",
  requiresConsentCategory: "marketing",
  init() {
    if (initialized || !config.enabled || !config.pixelId) {
      return;
    }

    loadExternalScript("https://analytics.tiktok.com/i18n/pixel/events.js");
    window.ttq?.load(config.pixelId);
    window.ttq?.page();
    initialized = true;
  },
  track(eventId: EventId, payload: EventPayload | undefined) {
    if (!initialized || !window.ttq) {
      return;
    }

    window.ttq.track(eventId, payload ?? {});
  },
};
