const ATTRIBUTION_STORAGE_KEY = "huma-attribution";
const UTM_PARAM_NAMES = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export interface AttributionData {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  landingPath: string;
  firstTouchAt: string;
}

function readStoredAttribution(): AttributionData | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AttributionData) : null;
  } catch {
    return null;
  }
}

function writeStoredAttribution(data: AttributionData) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage failures; attribution stays session-only for this load.
  }
}

/**
 * Captures first-touch campaign attribution (UTM parameters + landing path)
 * exactly once per browser and never overwrites it on later visits. Kept
 * entirely separate from Quiz/LLM data — this module is never imported by
 * the assessment engine, the analyze-assessment client, or any prompt
 * composition code, and no campaign identifier is ever added to an LLM
 * prompt.
 */
export function captureAttributionOnEntry(search: string, pathname: string): AttributionData {
  const existing = readStoredAttribution();
  if (existing) {
    return existing;
  }

  const params = new URLSearchParams(search);
  const hasAnyUtmParam = UTM_PARAM_NAMES.some((name) => params.has(name));

  const captured: AttributionData = {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmTerm: params.get("utm_term"),
    utmContent: params.get("utm_content"),
    landingPath: pathname,
    firstTouchAt: new Date().toISOString(),
  };

  if (hasAnyUtmParam) {
    writeStoredAttribution(captured);
  }

  return captured;
}

export function getStoredAttribution(): AttributionData | null {
  return readStoredAttribution();
}
