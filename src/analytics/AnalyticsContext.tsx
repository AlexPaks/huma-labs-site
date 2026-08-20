import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { analyticsService } from "./analytics-service";
import {
  getDefaultConsentState,
  getStoredConsentState,
  setStoredConsentState,
  clearStoredConsentState,
  type ConsentPreferences,
  type ConsentState,
} from "./consent-service";
import type { EventId, EventPayload } from "./event-catalog";

interface AnalyticsContextValue {
  consent: ConsentState;
  savePreferences: (preferences: ConsentPreferences) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  withdrawConsent: () => void;
  track: (eventId: EventId, payload?: EventPayload) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function AnalyticsContextProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(() => getStoredConsentState() ?? getDefaultConsentState());

  useEffect(() => {
    analyticsService.applyConsent(consent);
  }, [consent]);

  function track(eventId: EventId, payload?: EventPayload) {
    analyticsService.track(eventId, payload, consent);
  }

  function savePreferences(preferences: ConsentPreferences) {
    setStoredConsentState(preferences);
    const next: ConsentState = { essential: true, resolved: true, ...preferences };
    setConsent(next);
    analyticsService.track("consent_preferences_saved", undefined, next);
  }

  function acceptAll() {
    savePreferences({ functional: true, analytics: true, marketing: true });
  }

  function rejectAll() {
    savePreferences({ functional: false, analytics: false, marketing: false });
  }

  function withdrawConsent() {
    clearStoredConsentState();
    const next = getDefaultConsentState();
    // Fire the withdrawal event against the outgoing (still-granted) state,
    // since the point is to record that consent was withdrawn.
    analyticsService.track("consent_withdrawn", undefined, consent);
    setConsent(next);
  }

  return (
    <AnalyticsContext.Provider value={{ consent, savePreferences, acceptAll, rejectAll, withdrawConsent, track }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);

  if (!context) {
    throw new Error("Analytics context is not available.");
  }

  return context;
}
