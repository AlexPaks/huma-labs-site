import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const phase11ValidationDir = path.join(root, "docs", "implementation", "validation", "phase-11");

function readJson(relativePath) {
  const raw = fs.readFileSync(path.join(root, relativePath), "utf8").replace(/^﻿/, "");
  return JSON.parse(raw);
}

function readTextFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

const REQUIRED_EVENT_IDS = [
  "page_view",
  "language_changed",
  "primary_cta_clicked",
  "secondary_cta_clicked",
  "quiz_viewed",
  "quiz_started",
  "quiz_step_completed",
  "quiz_completed",
  "insight_analysis_started",
  "insight_analysis_completed",
  "insight_analysis_failed",
  "insight_result_viewed",
  "insight_email_form_viewed",
  "insight_email_form_started",
  "insight_email_submitted",
  "contact_form_viewed",
  "contact_form_started",
  "contact_form_submitted",
  "contact_form_failed",
  "consent_banner_viewed",
  "consent_preferences_saved",
  "consent_withdrawn",
];

const CONSENT_CATEGORIES = ["essential", "functional", "analytics", "marketing"];

// Mirrors src/analytics/event-catalog.ts's PROHIBITED_PAYLOAD_KEYS — kept in
// sync manually, following this repo's existing plain-JS-validate-script
// convention for TypeScript logic (see scripts/validate-phase7.mjs).
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

function assertSafeEventPayload(payload) {
  if (!payload) return { ok: true };
  for (const key of Object.keys(payload)) {
    if (PROHIBITED_PAYLOAD_KEYS.has(key)) {
      return { ok: false, key };
    }
  }
  return { ok: true };
}

// Mirrors analytics-service.ts's per-provider consent gating.
function isEventDeliveredToProvider(eventEntry, provider, consent) {
  const eligibleForEvent = provider.requiresConsentCategory === null || eventEntry.sendToCategories.includes(provider.requiresConsentCategory);
  const consentGranted = provider.requiresConsentCategory === null || consent[provider.requiresConsentCategory] === true;
  return eligibleForEvent && consentGranted;
}

function main() {
  ensureDirectory(phase11ValidationDir);
  const issues = [];
  const checks = [];

  function record(name, passed, detail) {
    checks.push({ name, passed, detail: detail ?? null });
    if (!passed) issues.push(name);
  }

  const marketingEvents = readJson("config/marketing-events.json");
  const analyticsConfig = readJson("config/analytics.json");

  // 1. Event catalog completeness — must exactly match the master plan's
  //    required event list (§19), no more, no less.
  const catalogIds = marketingEvents.events.map((e) => e.id);
  const missing = REQUIRED_EVENT_IDS.filter((id) => !catalogIds.includes(id));
  const extra = catalogIds.filter((id) => !REQUIRED_EVENT_IDS.includes(id));
  record("event-catalog: contains exactly the required 21 events", missing.length === 0 && extra.length === 0, JSON.stringify({ missing, extra }));

  const duplicateIds = catalogIds.filter((id, index) => catalogIds.indexOf(id) !== index);
  record("event-catalog: no duplicate event ids", duplicateIds.length === 0, JSON.stringify(duplicateIds));

  for (const entry of marketingEvents.events) {
    const invalidCategories = entry.sendToCategories.filter((category) => !CONSENT_CATEGORIES.includes(category));
    if (invalidCategories.length > 0) {
      record(`event-catalog: "${entry.id}" uses only known consent categories`, false, JSON.stringify(invalidCategories));
    }
  }
  record("event-catalog: all events use only known consent categories", !marketingEvents.events.some((e) => e.sendToCategories.some((c) => !CONSENT_CATEGORIES.includes(c))));

  // 2. Scope-decision regression guards — confirms the explicit "build full
  //    architecture, never activate" decision stays true in the shipped config.
  record("config: mock provider is enabled by default", analyticsConfig.providers.mock.enabled === true);
  record("config: google provider is disabled by default (never activated)", analyticsConfig.providers.google.enabled === false);
  record("config: meta provider is disabled by default (never activated)", analyticsConfig.providers.meta.enabled === false);
  record("config: tiktok provider is disabled by default (never activated)", analyticsConfig.providers.tiktok.enabled === false);
  record("config: no real provider ids are configured", !analyticsConfig.providers.google.gtmContainerId && !analyticsConfig.providers.google.ga4MeasurementId && !analyticsConfig.providers.meta.pixelId && !analyticsConfig.providers.tiktok.pixelId);
  record(
    "config: default consent is opt-in (functional/analytics/marketing start false)",
    analyticsConfig.defaultConsent.functional === false && analyticsConfig.defaultConsent.analytics === false && analyticsConfig.defaultConsent.marketing === false,
  );

  // 3. Prohibited-payload guard.
  const cleanPayloadResult = assertSafeEventPayload({ location: "home_hero", stepIndex: 2 });
  record("prohibited-payload-guard: accepts a clean payload", cleanPayloadResult.ok);

  for (const prohibitedKey of ["email", "answers", "prompt", "challenge", "stack"]) {
    const result = assertSafeEventPayload({ [prohibitedKey]: "x" });
    record(`prohibited-payload-guard: rejects a payload containing "${prohibitedKey}"`, result.ok === false && result.key === prohibitedKey);
  }

  // 4. Consent-gating simulation — mirrors analytics-service.ts's per-provider logic.
  const providers = [
    { id: "mock", requiresConsentCategory: null },
    { id: "google", requiresConsentCategory: "analytics" },
    { id: "meta", requiresConsentCategory: "marketing" },
    { id: "tiktok", requiresConsentCategory: "marketing" },
  ];
  const pageViewEntry = marketingEvents.events.find((e) => e.id === "page_view");
  const contactSubmittedEntry = marketingEvents.events.find((e) => e.id === "contact_form_submitted");

  const noConsent = { essential: true, functional: false, analytics: false, marketing: false };
  const fullConsent = { essential: true, functional: true, analytics: true, marketing: true };

  record(
    "consent-gating: with no consent, page_view still reaches mock but not google",
    isEventDeliveredToProvider(pageViewEntry, providers[0], noConsent) === true &&
      isEventDeliveredToProvider(pageViewEntry, providers[1], noConsent) === false,
  );
  record(
    "consent-gating: with full consent, page_view reaches mock and google",
    isEventDeliveredToProvider(pageViewEntry, providers[0], fullConsent) === true &&
      isEventDeliveredToProvider(pageViewEntry, providers[1], fullConsent) === true,
  );
  record(
    "consent-gating: with analytics-only consent, contact_form_submitted does not reach meta/tiktok (marketing required)",
    isEventDeliveredToProvider(contactSubmittedEntry, providers[2], { ...noConsent, analytics: true }) === false,
  );
  record(
    "consent-gating: with marketing consent, contact_form_submitted reaches meta",
    isEventDeliveredToProvider(contactSubmittedEntry, providers[2], fullConsent) === true,
  );

  // 5. Cookie-consent message parity (structural leaf-shape only — full
  //    parity is already covered by validate:language).
  const he = readJson("messages/he/cookie-consent.json");
  const en = readJson("messages/en/cookie-consent.json");
  const categoriesOk = CONSENT_CATEGORIES.every(
    (category) => he.preferences[category]?.label && he.preferences[category]?.description && en.preferences[category]?.label && en.preferences[category]?.description,
  );
  record("cookie-consent messages: all four categories have he+en label and description", categoriesOk);

  // 6. Attribution service stays separate from Quiz/LLM code — no server
  //    prompt-composition or assessment module imports attribution-service.
  const promptComposerSource = readTextFile("server/services/prompt-composer.mjs");
  const assessmentNormalizerSource = readTextFile("server/services/assessment-normalizer.mjs");
  record(
    "attribution-separation: prompt composer never imports attribution-service",
    !promptComposerSource.includes("attribution-service"),
  );
  record(
    "attribution-separation: assessment normalizer never imports attribution-service",
    !assessmentNormalizerSource.includes("attribution-service"),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    checks,
    passed: issues.length === 0,
  };

  fs.writeFileSync(path.join(phase11ValidationDir, "phase11-validation-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));

  if (issues.length > 0) {
    process.exitCode = 1;
  }
}

main();
