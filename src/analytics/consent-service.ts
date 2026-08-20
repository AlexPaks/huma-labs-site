import analyticsConfig from "../../config/analytics.json";
import type { ConsentCategory } from "./event-catalog";

const CONSENT_STORAGE_KEY = "huma-consent";
const CONSENT_VERSION = 1;

export interface ConsentPreferences {
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface ConsentState extends ConsentPreferences {
  essential: true;
  /** False until the user has made an explicit choice (accept/reject/save). */
  resolved: boolean;
}

interface StoredConsent {
  version: number;
  preferences: ConsentPreferences;
}

export function getDefaultConsentState(): ConsentState {
  const defaults = analyticsConfig.defaultConsent;
  return {
    essential: true,
    functional: defaults.functional,
    analytics: defaults.analytics,
    marketing: defaults.marketing,
    resolved: false,
  };
}

export function getStoredConsentState(): ConsentState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<StoredConsent> | null;
    if (parsed?.version !== CONSENT_VERSION || !parsed.preferences) {
      return null;
    }

    return { essential: true, resolved: true, ...parsed.preferences };
  } catch {
    return null;
  }
}

export function setStoredConsentState(preferences: ConsentPreferences): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const payload: StoredConsent = { version: CONSENT_VERSION, preferences };
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage failures; consent stays session-only for this load.
  }
}

export function clearStoredConsentState(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export function isCategoryGranted(consent: ConsentState, category: ConsentCategory): boolean {
  return consent[category] === true;
}
