import analyticsConfig from "../../../config/analytics.json";
import type { AnalyticsProvider } from "../analytics-provider";
import type { EventId, EventPayload } from "../event-catalog";
import { loadExternalScript } from "../tag-loader";

type FbqFunction = ((...args: unknown[]) => void) & { queue: unknown[][]; loaded: boolean };

declare global {
  interface Window {
    fbq?: FbqFunction;
  }
}

const config = analyticsConfig.providers.meta;
let initialized = false;

/**
 * Real Meta Pixel provider. Never activates on its own: init() is a no-op
 * unless the provider is explicitly enabled AND a real pixel id is
 * configured — neither is true by default, so the Meta Pixel script is
 * never injected and fbq is never called until that changes with explicit
 * marketing consent AND approval.
 */
export const metaProvider: AnalyticsProvider = {
  id: "meta",
  requiresConsentCategory: "marketing",
  init() {
    if (initialized || !config.enabled || !config.pixelId) {
      return;
    }

    if (!window.fbq) {
      const queue: unknown[][] = [];
      const fbq = ((...args: unknown[]) => {
        queue.push(args);
      }) as FbqFunction;
      fbq.queue = queue;
      fbq.loaded = true;
      window.fbq = fbq;
    }

    loadExternalScript("https://connect.facebook.net/en_US/fbevents.js");
    window.fbq!("init", config.pixelId);
    initialized = true;
  },
  track(eventId: EventId, payload: EventPayload | undefined) {
    if (!initialized || typeof window.fbq !== "function") {
      return;
    }

    window.fbq("trackCustom", eventId, payload ?? {});
  },
};
