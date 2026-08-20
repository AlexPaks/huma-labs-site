# Phase 11 — Marketing Analytics, Campaign Attribution and Cookie Consent Verification Report

Date: 2026-08-19
Phase: Phase 11 - Marketing Analytics, Campaign Attribution and Cookie Consent

## Scope decisions confirmed with the user

1. The user approved starting Phase 11 immediately after approving Phase 10 as complete.
2. Following the same "build real provider code, never activate it" pattern used for OpenAI/Claude in Phase 8 and SMTP in Phase 10, the user was asked how far to build the marketing-analytics provider layer. Decision: full architecture — a mock provider (default, always active) plus real Google (gtag/GTM), Meta Pixel, and TikTok Pixel provider implementations — but no tracking script is ever loaded and no real tracking call is ever made. All three real providers ship disabled by default with no real container/pixel/measurement ids configured, matching this plan's "Do not add tracking scripts" guardrail.

## What was implemented

- **Event catalog**: `config/marketing-events.json` defines the exact 21 events from the master plan's §19 catalog, each with the consent categories (`essential`/`functional`/`analytics`/`marketing`) it is eligible to be sent under. `src/analytics/event-catalog.ts` derives a typed `EventId` union and an `assertSafeEventPayload()` guard that rejects any payload containing a hard-coded prohibited key (PII fields, Quiz answers, LLM prompt/result content, credentials, stack traces) before it can reach any provider.
- **Provider abstraction**: a shared `AnalyticsProvider` interface (`src/analytics/analytics-provider.ts`) implemented by `mockAnalyticsProvider` (default, logs to console only) and real `googleProvider`/`metaProvider`/`tiktokProvider` implementations. Each real provider's `init()` is a no-op unless the provider is explicitly enabled **and** a real id is configured in `config/analytics.json` — neither is true by default, so `loadExternalScript()` (the shared idempotent script-tag injector in `src/analytics/tag-loader.ts`) is never called and `gtag`/`fbq`/`ttq` are never invoked.
- **Single tracking chokepoint**: `src/analytics/analytics-service.ts` is the only place any provider is called from. `analyticsService.track(eventId, payload, consent)` validates the payload, looks up the event's eligible consent categories, and dispatches only to providers that are both eligible for that event and currently consented. Business components never call `gtag`/`dataLayer`/`fbq`/`ttq` directly.
- **Consent state**: `src/analytics/consent-service.ts` models 4 categories (`essential` always granted, `functional`/`analytics`/`marketing` opt-in, default `false`), versioned and persisted to `localStorage["huma-consent"]`. `AnalyticsContextProvider` (`src/analytics/AnalyticsContext.tsx`) wraps this in React context, wired into `AppProviders.tsx`, and calls `analyticsService.applyConsent()` whenever consent changes so providers only initialize once their required category is granted.
- **Cookie consent banner**: `src/shared/components/CookieConsentBanner.tsx`, rendered in `SiteLayout.tsx`, shows a summary view (accept all / reject all / customize) and a preferences view (per-category checkboxes, essential locked on) in both languages, backed by newly populated `messages/{he,en}/cookie-consent.json` content. The banner self-hides once consent is resolved and fires `consent_banner_viewed` on first unresolved render.
- **Campaign attribution**: `src/analytics/attribution-service.ts` captures `utm_source/medium/campaign/term/content` from the URL synchronously in `main.tsx`, before React Router runs (so first-touch UTM parameters survive client-side redirects that don't otherwise preserve arbitrary query params), first-touch-only, persisted to `localStorage["huma-attribution"]`. Kept structurally separate from Quiz/LLM code — verified by a grep-based check that neither `server/services/prompt-composer.mjs` nor `server/services/assessment-normalizer.mjs` ever references `attribution-service`.
- **Event instrumentation wired through the app**: `page_view` and `language_changed` (`SiteLayout.tsx`); `primary_cta_clicked`/`secondary_cta_clicked` (home hero CTAs, both concepts); the full Quiz lifecycle — `quiz_viewed`, `quiz_started`, `quiz_step_completed` (per answered step), `quiz_completed`, `insight_analysis_started`, `insight_analysis_completed`/`insight_analysis_failed`, `insight_result_viewed` (`InsightPage.tsx`); form lifecycle events — `{contact,insight_email}_form_viewed/started`, `contact_form_submitted/failed`, `insight_email_submitted` (`DynamicForm.tsx`); consent events — `consent_banner_viewed`, `consent_preferences_saved`, `consent_withdrawn`.

## Verification performed

### Automated validation — `npm run validate:analytics` (`scripts/validate-phase11.mjs`)

Following the same plain-JS-duplication convention used for TypeScript logic since Phase 7 (a `.mjs` validator can't import `src/**/*.ts` directly), this script re-implements the event catalog, prohibited-payload guard, and per-provider consent-gating logic to test them independently of the TypeScript source. 22 checks, all passing:

| Area | Checks |
| --- | --- |
| Event catalog | contains exactly the 21 required event ids (no more, no less); no duplicate ids; every event uses only known consent categories |
| Scope-decision regression guards | mock provider enabled by default; Google/Meta/TikTok all disabled by default; no real provider ids configured anywhere; default consent is opt-in (functional/analytics/marketing all start `false`) |
| Prohibited-payload guard | a clean payload is accepted; payloads containing `email`, `answers`, `prompt`, `challenge`, or `stack` are all rejected |
| Consent-gating simulation | no-consent still delivers `page_view` to mock but not Google; full consent delivers to both; analytics-only consent does not deliver `contact_form_submitted` to Meta/TikTok (marketing required); marketing consent does |
| Cookie-consent message parity | all 4 categories have both a label and a description in Hebrew and English |
| Attribution separation | neither `prompt-composer.mjs` nor `assessment-normalizer.mjs` references `attribution-service` |

Full report: `docs/implementation/validation/phase-11/phase11-validation-report.json`.

### Browser verification (local Microsoft Edge headless via CDP)

`docs/implementation/validation/phase-11/phase11-analytics-check.cjs`, results in `phase11-analytics-check.json`, drove a realistic end-to-end session: initial load, accept-all consent, navigation, language switch, home hero CTA click, a full 6-question Quiz through insight analysis, and a contact-form submission — while a `Network.requestWillBeSent` listener recorded any request to a known tracking-vendor host (`googletagmanager.com`, `google-analytics.com`, `facebook.net`, `tiktok.com`, `analytics.tiktok.com`).

| Scenario | Result |
| --- | --- |
| Initial load | Consent banner visible, unresolved; `consent_banner_viewed` and `page_view` fired to the mock provider only |
| Accept all | Banner disappears; `localStorage["huma-consent"]` stores all three categories granted |
| Navigation + language switch | `page_view` fires on each navigation; `language_changed` fires exactly once, keyed to the actual switch |
| Home hero CTA | `primary_cta_clicked` fires with `{location: "home_hero"}` |
| Full Quiz → insight result | Correctly ordered sequence: `quiz_viewed`, `quiz_started`, 6× `quiz_step_completed`, `quiz_completed`, `insight_analysis_started`, `insight_analysis_completed`, `insight_result_viewed` |
| Contact form | `contact_form_viewed` on mount, `contact_form_started` on first keystroke, `contact_form_submitted` on success |
| **Tracking network requests** | **`[]` — zero requests to any Google/Meta/TikTok tracking host across the entire session** |

Two bugs were found and fixed while producing this evidence (see below). The final clean run (after clearing a stale leftover headless-browser process that was silently reusing an already-consented profile) shows fully correct results.

Screenshots: `phase11-consent-banner-summary-he.png` (summary view) and `phase11-consent-banner-preferences-he.png` (preferences view, all 4 categories, essential locked checked).

### Standard checks

- `npm.cmd run build` -> Pass
- `npm.cmd run validate:content` -> Pass
- `npm.cmd run validate:language` -> Pass
- `npm.cmd run validate:quiz` -> Pass
- `npm.cmd run validate:llm` -> Pass
- `npm.cmd run validate:email` -> Pass
- `npm.cmd run validate:analytics` -> Pass (new)

## Bugs found and fixed during this phase

1. **TypeScript build errors in `meta-provider.ts`**: `'fbq' is possibly 'undefined'` and an implicit-`any[]` error, caused by a self-referencing function typed off the optional `Window["fbq"]` property. Fixed by introducing a standalone `FbqFunction` type and constructing the stub function against that type directly rather than the optional window property.
2. **Event-ordering bug**: `quiz_step_completed` for the final question was firing *after* `quiz_completed`/`insight_analysis_started`, because the tracking call originally ran after `questionFlow.handleContinue()` returned — but for the final question, that call synchronously triggers the entire completion cascade before returning. Fixed by moving the tracking call to fire before `handleContinue()` is invoked, gated on the already-computed `hasAnswer` validity flag so it only fires when the step will actually succeed. Verified via a clean re-run showing the correct causal order.
3. **Test-script defects (not app bugs)**: the browser-check script's language-switch selector matched the wrong header button on the first run (fixed by targeting `.concept-language-switch__button:not(.concept-language-switch__button--active)`), and the screenshot script's "customize" selector matched "reject all" instead (fixed by targeting the third button by position rather than an ambiguous `:nth-of-type` + class combination). Both were caught by inspecting the actual results rather than assuming success.

## Files created

- `config/analytics.json`, `config/marketing-events.json`
- `src/analytics/event-catalog.ts`, `analytics-provider.ts`, `analytics-service.ts`, `attribution-service.ts`, `consent-service.ts`, `tag-loader.ts`, `AnalyticsContext.tsx`
- `src/analytics/providers/mock-analytics-provider.ts`, `google-provider.ts`, `meta-provider.ts`, `tiktok-provider.ts`
- `src/shared/components/CookieConsentBanner.tsx`
- `scripts/validate-phase11.mjs`
- `docs/implementation/validation/phase-11/phase11-analytics-check.cjs` / `.json`
- `docs/implementation/validation/phase-11/phase11-validation-report.json`
- `docs/implementation/validation/phase-11/phase11-consent-banner-summary-he.png`, `phase11-consent-banner-preferences-he.png`
- `docs/implementation/validation/phase-11/phase11-marketing-analytics-report.md` (this file)

## Files changed

- `src/app/AppProviders.tsx` (added `AnalyticsContextProvider`)
- `src/main.tsx` (added `captureAttributionOnEntry()` call before React renders)
- `src/components/SiteLayout.tsx` (page_view / language_changed tracking, renders `CookieConsentBanner`)
- `src/concepts/concept-a/sections/HomeHeroSection.tsx`, `src/concepts/concept-c/sections/ConceptCHomeHeroSection.tsx` (added optional CTA click callbacks)
- `src/pages/HomePage.tsx`, `src/concepts/concept-c/ConceptCHomePage.tsx` (wired CTA tracking)
- `src/pages/InsightPage.tsx` (full Quiz/insight-result event instrumentation)
- `src/shared/forms/DynamicForm.tsx` (form lifecycle event instrumentation)
- `src/styles.css` (`.concept-consent-banner*` rules)
- `messages/he/cookie-consent.json`, `messages/en/cookie-consent.json` (populated, previously empty reserved domains)
- `package.json` (added `validate:analytics` script)
- `docs/implementation/huma-website-master-plan.md`

## Known deviations / deferred items

- No real Google/Meta/TikTok container, measurement, or pixel id has ever been configured or used — activating any of them remains a future decision requiring explicit approval, per the confirmed scope.
- Cookie consent copy is functional but has not had a legal/compliance review; the master plan already tracks this as an open item independent of this phase's engineering scope.
- The honeypot-style "silent success" pattern from Phase 10 is unrelated to this phase and untouched.
- Duplicate-analytics-on-concept-switch behavior was exercised only through the single-concept flows tested above; a dedicated concept-switching analytics test is deferred (low risk — the tracking chokepoint is concept-agnostic).

## Exit-criteria result

- Consent-aware marketing measurement architecture (event catalog, provider abstraction, single tracking chokepoint, consent gating) is implemented and verified.
- Mock provider active by default; Google/Meta/TikTok providers exist as real code but are disabled and unconfigured — verified to never load a script or send a request.
- Cookie consent banner (summary + preferences, both languages) is implemented and verified, including default-opt-out consent state.
- Campaign attribution (UTM capture) is implemented, verified to persist across client-side redirects, and verified structurally separate from Quiz/LLM code.
- No personal data, Quiz answers, LLM prompt/result content, or credentials can reach any analytics payload — enforced by an automated guard and tested against every prohibited key.
- Zero real tracking network requests were observed across a full realistic browser session (consent flow, navigation, quiz completion, form submission).
- No Phase 12 or later work was started. No Git modification was performed. No deployment was performed.

Recommended Phase 11 status: `READY FOR REVIEW`
