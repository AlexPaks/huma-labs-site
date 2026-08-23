# HUMA Website Master Working Plan

Status: Authoritative planning and phase-tracking document for this workspace  
Last updated: 2026-08-20
Scope: Phases 0-14 are completed and approved; Phase 15 Git and GitHub and Phase 15.5 Concept D remain recorded as `READY FOR REVIEW`; the user subsequently requested the completed Brevo Transactional Email integration be formalized as Phase 15.6. Phase 15.6 is implemented and `READY FOR REVIEW` as of 2026-08-23. Phase 16 deployment remains `NOT STARTED`; readiness was audited without linking, configuring Vercel, or deploying.

## 1. Planning guardrails

- Do not modify application source code outside the currently approved phase without explicit approval.
- Do not install packages without explicit approval.
- Do not implement Phase 6 or later application work without explicit approval.
- Do not generate additional concept images without explicit approval.
- Do not overwrite approved concept PNG files without explicit approval.
- Do not create credentials.
- Do not call OpenAI or Claude.
- Do not send email.
- Do not add tracking scripts.
- Do not initialize or modify Git.
- Do not deploy.
- Do not redesign or implement the current homepage without explicit concept approval.
- Do not start Phase 6 implementation or any later implementation phase.
- Do not duplicate this master plan in another path.

## 2. Authoritative Sources and Priority

Use this authority order for planning, implementation, review, and fidelity decisions:

1. Approved existing HUMA content and meaning
2. Saved and implemented Concept D visual direction
3. Saved Concept A PNG files
4. Saved Concept C PNG files
5. Existing `docs/design-concepts/README.md`
6. HUMA Website Master Working Plan
7. Explicit future user approvals

Clarifications:

- `Concept A` remains the approved implemented baseline.
- `Concept C` is the authoritative direction for the current `Phase 5` implementation task.
- `Concept D` is the current production default following the user's explicit Phase 15.5 decision.
- Concept A and Concept C remain retained preview implementations and were not deleted.
- `Concept B` remains archived and must not be implemented.
- `SITE123` is a content, brand, and continuity reference only.
- `SITE123` code must not be copied.
- Concept PNG files are visual specifications, not final website UI assets.
- The final website must use semantic HTML and real components rather than rendered screenshots.

## 3. Current repository baseline

Current relevant frontend structure observed in this workspace:

- `src/content/siteContent.ts`
- `src/pages/HomePage.tsx`
- `src/pages/InsightPage.tsx`
- `src/components/ContactForm.tsx`
- `src/components/SectionIntro.tsx`
- `src/components/SiteLayout.tsx`
- `src/styles.css`

Current baseline findings:

- User-visible copy is currently split between `src/content/siteContent.ts`, `src/pages/HomePage.tsx`, `src/pages/InsightPage.tsx`, and `src/components/ContactForm.tsx`.
- The current contact experience is a presentational form with hardcoded labels and no secure submission flow.
- The current insight page contains hardcoded quiz, result, and CTA text.
- The current application is a Vite + React + TypeScript frontend with no implemented server-side LLM layer.
- No centralized analytics abstraction is present in the inspected structure.
- No consent-state layer is present in the inspected structure.
- No SEO page registry, metadata registry, sitemap generator, or robots policy is present in the inspected structure.

Phase implications:

- Phase 2 must externalize all user-visible copy and formalize one message system.
- Phase 4 and Phase 5 must sit on one shared application architecture rather than separate page copies.
- Phase 7 must replace the hardcoded six-question rendering with a schema-driven Quiz engine.
- Phase 8 must introduce secure server-side LLM analysis architecture.

## 4. Confirmed concept assets and review documentation

Confirmed design-concept documentation:

- `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\README.md`

Confirmed visual comparison or fidelity documentation:

- `docs/design-concepts/README.md`
- `docs/implementation/validation/phase-4/concept-a-design-system.md`
- `docs/implementation/validation/phase-4/concept-a-fidelity-ledger.md`

| Concept | Asset | Exact path | Viewport | Section | Status |
| --- | --- | --- | --- | --- | --- |
| Concept A | `concept-a-hero-desktop-v2.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-a-hero-desktop-v2.png` | Desktop | Hero | hero v2 assets persisted and verified |
| Concept A | `concept-a-hero-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-a-hero-desktop.png` | Desktop | Hero | Archived supporting reference only |
| Concept A | `concept-a-insight-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-a-insight-desktop.png` | Desktop | Organizational Insight | Confirmed review asset |
| Concept A | `concept-a-capabilities-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-a-capabilities-desktop.png` | Desktop | Capabilities | Archived supporting reference for typography and flat-thread treatment only |
| Concept A | `concept-a-hero-mobile-v2.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-a-hero-mobile-v2.png` | Mobile | Hero | hero v2 assets persisted and verified |
| Concept A | `concept-a-hero-mobile.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-a-hero-mobile.png` | Mobile | Hero | Archived supporting reference only |
| Concept A | `concept-a-problem-insight-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-a-problem-insight-desktop.png` | Desktop | Problem framing and Insight entry | Confirmed readiness asset |
| Concept A | `concept-a-insight-flow-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-a-insight-flow-desktop.png` | Desktop | Insight flow | Authoritative desktop active-question reference |
| Concept A | `concept-a-insight-result-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-a-insight-result-desktop.png` | Desktop | Insight result | Authoritative structured-result reference |
| Concept A | `concept-a-capabilities-method-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-a-capabilities-method-desktop.png` | Desktop | Capabilities and method | Authoritative combined capabilities and methodology reference |
| Concept A | `concept-a-challenges-formats-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-a-challenges-formats-desktop.png` | Desktop | Challenges and development formats | Confirmed readiness asset |
| Concept A | `concept-a-outcomes-contact-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-a-outcomes-contact-desktop.png` | Desktop | Outcomes and contact | Structural reference only; omit empty credibility placeholders in implementation |
| Concept A | `concept-a-insight-mobile.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-a-insight-mobile.png` | Mobile | Insight flow | Authoritative mobile active-question reference |
| Concept B | `concept-b-hero-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-b-hero-desktop.png` | Desktop | Hero | Archived, do not implement |
| Concept B | `concept-b-insight-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-b-insight-desktop.png` | Desktop | Organizational Insight | Archived, do not implement |
| Concept B | `concept-b-capabilities-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-b-capabilities-desktop.png` | Desktop | Capabilities | Archived, do not implement |
| Concept B | `concept-b-hero-mobile.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-b-hero-mobile.png` | Mobile | Hero | Archived, do not implement |
| Concept C | `concept-c-hero-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-c-hero-desktop.png` | Desktop | Hero | Confirmed review asset |
| Concept C | `concept-c-problem-insight-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-c-problem-insight-desktop.png` | Desktop | Problem framing and Insight entry | Confirmed review asset |
| Concept C | `concept-c-insight-flow-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-c-insight-flow-desktop.png` | Desktop | Insight flow | Confirmed review asset |
| Concept C | `concept-c-insight-result-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-c-insight-result-desktop.png` | Desktop | Insight result | Confirmed review asset |
| Concept C | `concept-c-capabilities-method-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-c-capabilities-method-desktop.png` | Desktop | Capabilities and method | Confirmed review asset |
| Concept C | `concept-c-challenges-formats-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-c-challenges-formats-desktop.png` | Desktop | Challenges and development formats | Confirmed review asset |
| Concept C | `concept-c-outcomes-contact-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-c-outcomes-contact-desktop.png` | Desktop | Outcomes and contact | Confirmed review asset |
| Concept C | `concept-c-hero-mobile.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-c-hero-mobile.png` | Mobile | Hero | Confirmed review asset |
| Concept D | `concept-d-home-desktop.png` | `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-d-home-desktop.png` | Desktop | Complete Home direction | Selected and implemented in Phase 15.5 |

Current confirmed blockers from design references:

- Concept A normalized visual specification persisted and approved by user.
- Phase 4 implementation evidence is saved under `docs/implementation/validation/phase-4/`, final overlap verification is complete, targeted localized Contact anchor correction evidence is now saved alongside the phase artifacts, and the phase is `COMPLETED` with `User approved` on `2026-08-18`.
- Phase 5 implementation evidence is saved under `docs/implementation/validation/phase-5/`, including the separate Concept C fidelity ledger, and the phase is `COMPLETED` with `User approved` on `2026-08-19` (after a same-day fidelity correction to the hero, Problem/Insight, and Capabilities/Method sections, requested by the user and verified against the reference images before approval).
- Phase 6 implementation evidence is saved under `docs/implementation/validation/phase-6/`, including `phase6-concept-switching-report.md`, and the phase is `COMPLETED` with `User approved` on `2026-08-19`.
- Phase 7 implementation evidence is saved under `docs/implementation/validation/phase-7/`, including `phase7-dynamic-assessment-report.md` and a new `validate:quiz` script, and the phase is `COMPLETED` with `User approved` on `2026-08-19`.
- Phase 8 implementation evidence is saved under `docs/implementation/validation/phase-8/`, including `phase8-secure-llm-report.md` and a new `validate:llm` script, and the phase is `COMPLETED` with `User approved` on `2026-08-19`. Scope confirmed with the user before implementation: build the full provider architecture including real OpenAI and Claude provider implementations, but never call either service with real credentials in this phase — matching the master plan's own "Do not call OpenAI or Claude" guardrail and the recommended mock-provider-first order in §13. Installing the `openai` and `@anthropic-ai/sdk` packages was explicitly approved as part of this scope decision. Neither service was ever actually called over the network; verified instead via realistic fake-response parsing tests and confirming both providers fail safe (`PROVIDER_UNAVAILABLE`) with no credentials configured.
- Phase 9 implementation evidence is saved under `docs/implementation/validation/phase-9/`, including `phase9-dynamic-result-report.md`, and the phase is `COMPLETED` with `User approved` on `2026-08-19`. Scope confirmed with the user before implementation: the new dynamic result fields (`executiveSummary`, `organizationalAnalysis`, `possibleOrganizationalImpact`, `suggestedNextStep`, `disclaimer`) have no existing slot in the approved Concept A/C result screens; rather than adding new UI sections for them, they map only onto existing approved UI slots (`primaryCapability` → the capability heading, `signalsToExamine` → the existing focus-items list, `recommendedDirection.{discover,design,act}` → the existing three-step process list). The unmapped fields are not visually rendered in this phase — documented as a known, explicit deviation, not a silent omission. A pre-existing Phase 4 bug (Concept A's focus-items list rendering with invisible text due to a `list-style` + `display:grid` CSS interaction) was found while verifying the dynamic render and fixed — confirmed present in the already-approved `docs/implementation/validation/phase-4/final-insight-he-desktop.png`, so this was not a Phase 9 regression.
- Phase 10 implementation evidence is saved under `docs/implementation/validation/phase-10/`, including `phase10-secure-email-report.md` and a new `validate:email` script, and the phase is `COMPLETED` with `User approved` on `2026-08-19`. Scope confirmed with the user before implementation: build a real generic SMTP provider only (via `nodemailer`, installation explicitly approved), no vendor-specific email API, matching the mock-first pattern from Phase 8; and the insight-delivery email includes only the structured `primaryCapability`/`secondaryCapabilities` fields, never raw LLM narrative text. No real email was ever sent; the SMTP provider was verified to fail safe with no credentials configured.
- Phase 11 implementation evidence is saved under `docs/implementation/validation/phase-11/`, including `phase11-marketing-analytics-report.md` and a new `validate:analytics` script, and the phase is `COMPLETED` with `User approved` on `2026-08-20`. Scope confirmed with the user before implementation: build the full provider architecture including real Google/Meta/TikTok adapters, but never activate any of them or load any real tracking script — matching the master plan's "Do not add tracking scripts" guardrail and the same mock-first pattern used in Phases 8 and 10. No real tracking script was ever loaded and no real tracking network request was ever sent, confirmed via a `Network.requestWillBeSent` browser check across a full realistic session (consent flow, navigation, quiz completion, form submission) showing zero requests to any Google/Meta/TikTok host.
- Phase 12 implementation evidence is saved under `docs/implementation/validation/phase-12/`, including `phase12-seo-report.md` and a new `validate:seo` script, and the phase is `COMPLETED` with `User approved` on `2026-08-20`. Scope confirmed with the user before implementation: crawlable rendering via build-time pre-rendering using the existing local headless-browser tooling (no new npm dependency, no SSR conversion); `robots.txt` explicitly allows both `OAI-SearchBot` and `GPTBot`; a placeholder base domain (`https://www.huma-labs.example`) is used everywhere a real domain is needed, pending the final-domain decision (§23). Verified via a genuine non-JS-executing HTTP fetch (Node's `fetch`, no script execution) against the real `npm run build` output showing correct, non-duplicated SEO tags and real visible content on all four indexable routes.
- Phase 13 implementation evidence is saved under `docs/implementation/validation/phase-13/`, including `phase13-qa-report.md` and a new `validate:qa` script, and the phase is `COMPLETED` with `User approved` on `2026-08-20`. Scope confirmed with the user before implementation: this is a QA/validation sweep over Phases 4-12 (no new production features); accessibility auditing built on `axe-core` (installed as a dev-only dependency, explicitly approved) run through the existing local headless-browser tooling. Three real, pre-existing accessibility defects (insufficient button contrast, duplicate navigation landmarks, a missing page-level heading on the Insight route) were found and fixed within this phase; the final full sweep across both concepts, both languages, and both pages at mobile and desktop viewports shows zero accessibility violations and zero real tracking requests.
- Phase 14 implementation evidence is saved under `docs/implementation/validation/phase-14/`, including `phase14-concept-decision-report.md` and a new `validate:concept-decision` script, and the phase is `COMPLETED` with `User approved` on `2026-08-20`. This is a decision phase, not an implementation phase: the user was asked to choose the final production concept after reviewing Phase 13's QA evidence (both concepts are fully implemented, fidelity-verified, and pass identical QA), and chose **Concept A**. Scope confirmed with the user: record the decision and confirm `siteConfig.defaultConcept` matches it (it already did — `"a"` — so no code change was required); Concept C's implementation is explicitly retained in the codebase, not removed, per the user's explicit choice to defer any cleanup rather than perform it now.
- Phase 15 implementation evidence is saved under `docs/implementation/validation/phase-15/`, including `phase15-git-github-report.md` and a new `validate:git` script, and the phase is `READY FOR REVIEW` pending user approval as of `2026-08-20`. Scope confirmed with the user before implementation: a single clean initial commit representing the current final state (not a fabricated per-phase history, since the project was not tracked in Git from day one); GitHub publication targets the user's existing repository at `https://github.com/AlexPaks/huma-labs-site`, confirmed empty via `git ls-remote` before any local Git operation. The repository was initialized, `.gitignore` reviewed and hardened (added `.claude/`), two stray unreferenced `vite.config.js`/`vite.config.d.ts` build artifacts removed, a `README.md` added, and two clean commits created on `main` with the `origin` remote configured. The `git push` itself could not be completed by the agent — Windows Credential Manager (`wincred`) requires an interactive authentication prompt that this tool's non-interactive shell cannot display — so the user explicitly chose to run `git push -u origin main` themselves in their own terminal.
- Phase 15.5 implementation evidence is saved under `docs/implementation/validation/phase-15.5/`. The user selected Concept D, approved its implementation, and requested it as the default. The implementation preserves the Concept A information architecture while adding the selected structural photo system, four responsive photographic assets, and a dedicated `data-concept="d"` presentation layer. Build, content, language, and local Edge desktop/mobile verification pass. No Git commit, push, or deployment was performed.
- Phase 15.6 implementation evidence is saved under `docs/implementation/validation/phase-15.6/`. The user selected Brevo for transactional email and requested the work be formalized as Phase 15.6. A direct server-side Brevo provider was added to the existing Phase 10 abstraction with sandbox enabled by default; mock and SMTP remain available. No Brevo network request or real email was sent. During readiness inspection, exposed working-tree credentials were moved from `.env.example` to gitignored `.env.local`; Git history was clean, but both keys require rotation before external validation or deployment.
- Phase 16 readiness evidence is saved under `docs/implementation/validation/phase-16-readiness/`. The audit confirmed the build path and three Vercel functions are present, while identifying blocking work: credential rotation, production-domain approval, Phase 15.6 commit/push, Vercel CLI/project link, sensitive environment configuration, Preview deployment, and end-to-end provider/SEO/log verification. Phase 16 remains `NOT STARTED`.

Hero v2 persistence verification record:

- Verification date: `2026-08-17`
- Desktop target path: `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-a-hero-desktop-v2.png`
- Desktop file size: `1144909` bytes
- Desktop dimensions: `1536 x 1024`
- Desktop SHA-256 reference: `1BB484CCBA10C8B1CCAF5B2C34ACB3B40DC9D7FF16093BD4B166A17E2DC07971`
- Mobile target path: `D:\alexp\HumaLab Projects\huma-labs-site\docs\design-concepts\images\concept-a-hero-mobile-v2.png`
- Mobile file size: `1214297` bytes
- Mobile dimensions: `864 x 1821`
- Mobile SHA-256 reference: `D4FD23ACCD5B5E3D7E670A1AD21031E9590E0D2F55E17B5EBCD87905C8445C09`
- Visual-open result: both target files opened successfully in the image viewer and showed no crop or corruption.
- Environment note: direct byte-level hash reads against the saved target files stalled in the shell environment, so the SHA-256 values above are the verified source-reference hashes. The saved target file sizes matched the verified source sizes exactly, and the opened target renders matched the opened source renders with no visible re-encoding difference.

## 5. Shared content, messages, and configuration

All user-visible text in the website must be loaded from external localized message files.

React, TypeScript, CSS, and concept-specific components must not contain hardcoded user-visible copy.

Hebrew remains the source language.

English must contain a complete professional translation.

Stable identifiers must not be translated, including:

- question IDs
- field IDs
- option IDs
- capability IDs
- concept IDs
- language IDs
- event IDs
- provider mapping IDs
- consent-category IDs
- API status codes

Planned starting structure:

```text
messages/
  he/
    common.json
    navigation.json
    homepage.json
    assessment.json
    insight-result.json
    contact-form.json
    validation.json
    system.json
    cookie-consent.json
    privacy.json
    seo.json
  en/
    common.json
    navigation.json
    homepage.json
    assessment.json
    insight-result.json
    contact-form.json
    validation.json
    system.json
    cookie-consent.json
    privacy.json
    seo.json
```

Message architecture requirements:

- Typed message keys
- Runtime validation
- Development-time missing-key errors
- Structural parity between Hebrew and English
- Variable interpolation
- Pluralization where required
- Safe rich-text handling
- No raw HTML from JSON
- Duplicate-key detection
- Unused-key reporting
- Message-file versioning

Configuration contains:

- enabled fields
- field order
- validation rules
- conditional visibility
- form version
- feature flags
- provider state
- tracking IDs
- event mappings
- robots rules
- sitemap inclusion
- indexable state

Rule:

- Do not mix translated labels with functional configuration when stable message keys can be used.

## 6. Shared Concept Architecture

Plan one application containing:

- one content source
- one message system
- one Quiz engine
- one form engine
- one LLM result model
- one email service
- one analytics service
- one SEO registry
- two visual presentation layers

Planned maintainable structure:

```text
src/
  shared/
    components/
    forms/
    assessment/
    hooks/
    schemas/
  concepts/
    concept-a/
      components/
      layout/
      tokens/
    concept-c/
      components/
      layout/
      tokens/
```

Rules:

- Do not implement one giant component containing repeated inline concept conditions.
- Do not duplicate the complete homepage.

Concept-specific differences may exist only in:

- layout
- typography
- spacing
- section rhythm
- container model
- copper thread
- header
- hero
- capability presentation
- Quiz framing
- result presentation
- contact presentation

## 7. Concept A — Implementation Requirements

Concept A is defined as:

- editorial
- strategic
- executive-document character
- typography-led
- open composition
- restrained copper thread
- limited card usage
- calm organizational authority
- strong RTL typography
- strong mobile hierarchy

Concept A must not become:

- a generic consulting template
- a SaaS landing page
- a card grid
- an icon-heavy website
- a stock-photo website
- a decorative AI-art website

Implementation must be compared section by section with the saved Concept A PNG files.

## 8. Concept C — Implementation Requirements

Concept C is defined as:

- a refined continuation of the current HUMA identity
- warm off-white
- dark charcoal typography
- terracotta or copper accent
- familiar and approachable
- stronger hierarchy
- stronger organizational credibility
- reduced visual emptiness
- fewer generic containers
- meaningful copper-thread behavior
- strong mobile composition

Concept C must not become:

- Concept A with different colors
- a copied SITE123 implementation
- a generic workshop site
- a repetitive rounded-card page

Implementation must be compared section by section with the saved Concept C PNG files.

## 9. Concept Switching

Plan support for:

- `?concept=a`
- `?concept=c`
- localStorage persistence during review
- configurable default concept
- internal concept-review switcher
- ability to hide the switcher
- safe switching without losing Quiz state
- safe switching without duplicate analytics
- safe switching without duplicate canonical URLs

Planned configuration direction:

```json
{
  "defaultConcept": "a",
  "defaultLanguage": "he",
  "showConceptSwitcher": true,
  "showLanguageSwitcher": true
}
```

Suggested configuration file:

- `config/site.json`

Clarifications:

- Concept query parameters are for development and review only.
- The switcher is not part of the public HUMA marketing message.
- Only the final selected concept will be indexable in production.
- The alternative implementation must not be deleted without explicit approval.

## 10. Dynamic forms

The contact section and any email-capture form must be dynamically configured.

Planned public form-definition files:

```text
forms/
  contact-form.json
  insight-email-form.json
```

Each form definition must support:

- stable form ID
- form version
- enabled or disabled state
- field order
- stable field ID
- field type
- message key for label
- message key for placeholder
- message key for help text
- required or optional
- validation rules
- minimum and maximum length
- pattern where appropriate
- select options
- multiple selection
- conditional visibility
- default value where safe
- consent requirement
- submit-button message key
- success-message key
- error-message key

Initially supported field types:

- text
- email
- telephone
- textarea
- select
- multi-select
- checkbox
- consent

The rendering engine must not assume a fixed set or fixed order of fields.

`Concept A` and `Concept C` must use the same:

- form definitions
- field IDs
- validation rules
- submission payload
- email service
- success and error state model

## 11. Dynamic Organizational Insight Quiz

The Quiz definition must be external to React components.

Plan language-independent structure and localized messages.

Each question must support:

- stable question ID
- Quiz version
- question type
- required state
- message key
- stable option IDs
- option message keys
- display order
- validation rules
- conditional visibility
- branching
- next-question rules
- optional capability mapping
- optional score mapping

Supported initial types:

- single-choice
- multiple-choice
- short-text
- long-text

The engine must not assume exactly six questions.

The current six HUMA questions remain the initial content.

Adding, removing, disabling, reordering, or conditionally displaying a question must not require editing React components.

Hebrew and English must share:

- Quiz version
- question IDs
- option IDs
- types
- validation
- branching
- capability mappings

Only localized messages may differ.

Plan structural-parity validation between languages.

Shared Quiz runtime requirements:

- dynamic number of steps
- progress based on visible questions
- back and next
- answer validation
- conditional branches
- answer preservation
- language switching
- concept switching
- keyboard interaction
- completion payload
- restart
- safe local persistence where approved
- mock result before LLM integration

Quiz state must not be stored separately by Concept A and Concept C.

## 12. Secure LLM Integration

After Quiz completion:

1. Validate the completion payload.
2. Normalize answers.
3. Send only approved data to a server-side endpoint.
4. Load the selected language prompt.
5. Call the configured provider.
6. Validate the structured response.
7. Normalize the result.
8. Return a safe result and request ID.
9. Render the result in the selected concept.

Planned endpoint:

- `POST /api/organizational-insight/analyze`

Rules:

- The browser must never call OpenAI or Claude directly.
- The browser must never receive `OPENAI_API_KEY`.
- The browser must never receive `ANTHROPIC_API_KEY`.
- The browser must never receive provider credentials.
- The browser must never receive internal system prompts.
- The browser must never receive raw provider errors.
- The browser must never receive stack traces.
- API keys must come only from server-side environment variables.

## 13. Provider abstraction

Planned structure:

```text
server/
  api/
    analyze-assessment.ts
  providers/
    llm-provider.ts
    mock-provider.ts
    openai-provider.ts
    claude-provider.ts
  prompts/
    he/
      organizational-insight.md
    en/
      organizational-insight.md
  schemas/
    assessment-request.schema.ts
    insight-result.schema.ts
  services/
    assessment-normalizer.ts
    prompt-loader.ts
    prompt-composer.ts
    result-validator.ts
```

The frontend must not know which provider produced the result.

Provider selection must come from secure server configuration such as:

- `LLM_PROVIDER=openai`
- `LLM_PROVIDER=claude`

Recommended order:

1. Mock Provider first
2. OpenAI as the first real provider
3. Claude through the same provider interface
4. No real credentials until explicit approval

Keep the final provider and model as open decisions.

## 14. External LLM Prompts

Prompt files:

- `server/prompts/he/organizational-insight.md`
- `server/prompts/en/organizational-insight.md`

Prompts must not be:

- hardcoded in API handlers
- stored in React
- stored under `public/`
- included in the frontend bundle
- sent to the browser
- duplicated per visual concept

Both language prompts must share:

- purpose
- HUMA terminology
- analysis rules
- safety constraints
- output schema
- prompt version

The prompt composer must combine:

- language
- Quiz version
- prompt version
- stable question IDs
- stable option IDs
- localized questions
- localized selected answers
- open-text answers
- required output schema

Rule:

- Do not build the prompt through fragile string concatenation inside the API endpoint.

## 15. Structured Organizational Insight Result

Define one provider-independent result schema containing:

- Result ID
- Quiz version
- Prompt version
- Language
- Primary capability
- Secondary capabilities
- Executive summary
- Organizational analysis
- Possible organizational impact
- Three signals or areas to examine
- Recommended development direction
- Discover recommendation
- Design recommendation
- Act recommendation
- Suggested next step
- Disclaimer

The frontend must render this structure.

Rules:

- Do not display arbitrary raw LLM output.
- Plan OpenAI Structured Outputs where supported.
- Plan equivalent validation and normalization for Claude.

## 16. LLM failure states and runtime protection

Plan localized states for:

- Preparing analysis
- Analysis in progress
- Success
- Invalid assessment
- Unsupported Quiz version
- Rate limited
- Provider unavailable
- Timeout
- Invalid provider output
- Retry
- Safe fallback result

The user must not lose completed Quiz answers if the LLM request fails.

Plan:

- request size limits
- open-text limits
- rate limiting
- provider timeout
- retry limit
- prompt-injection protection
- log redaction
- cost configuration
- usage monitoring
- mock provider
- request IDs

Rule:

- Do not send campaign attribution data to the LLM.

## 17. Secure email architecture

Email must be sent through a secure server-side or serverless endpoint.

Planned routes:

- `POST /api/contact`
- `POST /api/insight/deliver`

The browser must never receive or contain:

- SMTP passwords
- email-service API keys
- private recipient addresses when they should remain internal
- provider credentials
- complete internal email templates

Planned provider-neutral structure:

```text
server/
  api/
    contact.ts
    deliver-insight.ts
  email/
    email-provider.ts
    email-service.ts
    providers/
      mock-email-provider.ts
      production-email-provider.ts
  templates/
    he/
      contact-notification.md
      contact-confirmation.md
      insight-delivery.md
    en/
      contact-notification.md
      contact-confirmation.md
      insight-delivery.md
  schemas/
    contact-request.schema.ts
    insight-delivery-request.schema.ts
```

Rules:

- Do not send email directly from React.
- Do not place server-side email templates under `public/`.
- The client must not be allowed to submit an arbitrary recipient email address.

## 18. Growth discovery and measurement strategy

This plan includes one consolidated strategy for:

1. Marketing Analytics
2. Campaign Attribution
3. Cookie and Tracking Consent
4. Google Search visibility
5. ChatGPT Search visibility
6. Multilingual SEO
7. Search and marketing performance measurement

Separate implementation phases remain required:

- `Phase 11: Marketing Analytics, Campaign Attribution and Cookie Consent`
- `Phase 12: SEO, Google Search and AI Search Visibility`

Shared infrastructure must avoid duplicating:

- messages
- privacy rules
- consent state
- performance requirements
- environment configuration
- validation
- monitoring

Shared architecture direction:

```text
src/
  analytics/
    analytics-service.ts
    analytics-provider.ts
    consent-service.ts
    attribution-service.ts
    tag-loader.ts
    event-catalog.ts
    providers/
      mock-analytics-provider.ts
      google-provider.ts
      meta-provider.ts
      tiktok-provider.ts
  seo/
    seo-service.ts
    page-registry.ts
    metadata-builder.ts
    structured-data-builder.ts

config/
  analytics.json
  marketing-events.json
  seo-pages.json
  site.json
```

## 19. Marketing analytics, attribution, and cookie consent

Plan support for:

- Google Tag Manager
- Google Analytics 4
- Google Ads conversions
- Google Consent Mode
- Meta Pixel for Facebook and Instagram
- TikTok Pixel
- campaign attribution
- UTM parameters
- conversion measurement
- Hebrew cookie-consent interface
- English cookie-consent interface
- RTL and LTR
- Development Mock mode

Provider configuration must be external and must support:

- provider enabled state
- environment
- debug mode
- consent requirement
- provider IDs
- conversion labels
- provider event mappings

Business components must not call:

- `gtag`
- `dataLayer`
- `fbq`
- `ttq`

All marketing events must use one shared analytics service with one internal event catalog.

Required consent categories:

- Essential
- Functional
- Analytics
- Marketing

Before consent is resolved:

- Essential functionality may operate.
- Optional analytics follows the approved policy.
- Marketing tracking must not send full marketing events without required consent.
- Meta Pixel must not activate before approved marketing consent.
- TikTok Pixel must not activate before approved marketing consent.
- Google tags must receive the approved default consent state.

Required internal events:

- `page_view`
- `language_changed`
- `primary_cta_clicked`
- `secondary_cta_clicked`
- `quiz_viewed`
- `quiz_started`
- `quiz_step_completed`
- `quiz_completed`
- `insight_analysis_started`
- `insight_analysis_completed`
- `insight_analysis_failed`
- `insight_result_viewed`
- `insight_email_form_viewed`
- `insight_email_form_started`
- `insight_email_submitted`
- `contact_form_viewed`
- `contact_form_started`
- `contact_form_submitted`
- `contact_form_failed`
- `consent_banner_viewed`
- `consent_preferences_saved`
- `consent_withdrawn`

Prohibited marketing payload data:

- name
- email
- telephone
- organization name
- Quiz answers
- free text
- organizational challenge description
- LLM prompt
- LLM result
- email body
- provider credentials
- stack trace
- raw error response

Campaign attribution must remain separate from Quiz and LLM analysis.

Do not add campaign identifiers to the LLM prompt.

Do not require server-side marketing tracking in the initial implementation.

## 20. SEO, Google Search, and AI Search visibility

Plan the website for eligibility in:

- Google Search
- ChatGPT Search
- other search engines
- AI answer engines
- Hebrew searches
- English searches

Do not promise:

- first-page placement
- guaranteed ranking
- guaranteed indexing
- guaranteed ChatGPT citation
- guaranteed AI visibility
- guaranteed organic traffic

The main public content must not depend on crawlers executing complex client-side JavaScript.

Later approve one crawlable rendering strategy:

- static generation
- pre-rendering
- server-side rendering
- another verified crawlable strategy

Preferred public language URLs:

- `/he/`
- `/en/`

Do not use `?lang=he` or `?lang=en` as primary indexable language URLs.

Concept URLs:

- `?concept=a`
- `?concept=c`

are review-only and must not become separate production canonicals or separate indexable pages.

Plan support for:

- canonical URLs
- `hreflang`
- localized metadata
- localized Open Graph
- `robots.txt`
- `sitemap.xml`
- structured data based on visible verified content only
- `OAI-SearchBot` policy
- `GPTBot` decision documentation

Do not:

- index private result pages
- include user-specific results in sitemap
- include internal documentation in sitemap
- add fake structured-data claims
- treat concept PNGs as indexable content

## 21. Shared privacy, abuse-protection, performance, and validation

Apply these rules across messages, forms, LLM, email, marketing, SEO, and AI search:

- Do not send personal data to marketing providers without explicit approval.
- Do not send Quiz answers to marketing providers.
- Do not send Quiz open-text answers to marketing providers.
- Do not send LLM prompts or raw results to marketing providers.
- Do not send contact-form messages or email content to marketing providers.
- Do not expose private Quiz results to search crawlers.
- Do not use `robots.txt` as a security mechanism.
- Client-side validation must never replace server-side validation.
- The user must not lose form or Quiz data after recoverable failures.
- Marketing and consent scripts must not materially damage the primary experience.

Shared runtime protections to plan:

- server-side validation
- rate limiting
- request size limits
- field-length limits
- open-text limits
- honeypot field
- duplicate-submission protection
- provider timeout
- retry limits
- log redaction
- request IDs
- mock mode for email and analytics

Shared validation matrix must cover:

- consent behavior
- duplicate-tag prevention
- duplicate-event prevention
- Quiz persistence
- LLM failure handling
- safe result rendering
- multilingual metadata
- canonical rules
- `hreflang`
- robots rules
- sitemap validity
- no private indexing
- no prohibited provider payload data

## 22. Consolidated risks

Each risk appears only once.

| Risk | Likelihood | Impact | Mitigation | Responsible phase |
| --- | --- | --- | --- | --- |
| Marketing tags loading before consent | Medium | High | Centralized consent-aware tag loader, privacy-first defaults, pre-consent blocking tests | Phase 11 |
| Incorrect consent defaults | Medium | High | Explicit consent model, versioned consent state, legal review before production | Phase 11 |
| Meta or TikTok loading before consent | Medium | High | Marketing category gating, provider-init guards, network verification | Phase 11 |
| Google Tag Manager bypassing consent | Medium | High | Application-owned consent state, consent-mode verification, container governance | Phase 11 |
| Duplicate page views | Medium | Medium | SPA-aware analytics service, route deduplication, concept-switch guardrails | Phase 11 |
| Duplicate conversions | Medium | High | Success-state-only conversions, event-state gating, provider deduplication rules | Phase 11 |
| Personal data leaking to providers | Low | Critical | Allowlisted payload schemas, prohibited-field enforcement, privacy audit | Phases 11 and 13 |
| Quiz or LLM data leaking to providers | Medium | Critical | Separate analytics schemas, no raw Quiz or LLM content in tracking, payload inspection | Phases 8, 11, and 13 |
| Incorrect attribution | Medium | Medium | Stable attribution service, defined source precedence, verification matrix | Phase 11 |
| Lost campaign parameters | Medium | Medium | Centralized attribution capture, controlled persistence, SPA transition tests | Phase 11 |
| Development data contaminating production | Medium | Medium | Separate environments, mock mode, production-only IDs, environment restrictions | Phase 11 |
| Third-party script failure | Medium | Medium | Provider isolation, timeouts, non-blocking adapters, graceful degradation | Phase 11 |
| Third-party scripts reducing performance | High | High | Performance budgets, delayed loading rules, tag timing audits | Phases 11 and 13 |
| Main content available only after JavaScript | Medium | High | Approved crawlable rendering strategy, production-like HTML verification | Phase 12 |
| Duplicate language URLs | Medium | High | Stable `/he/` and `/en/` strategy, canonical rules, redirect policy | Phase 12 |
| Incorrect canonical URLs | Medium | High | Typed SEO page registry, metadata validation, crawl audits | Phase 12 |
| Missing or incorrect `hreflang` | Medium | High | Bidirectional alternates, page-registry checks, validation tooling | Phase 12 |
| Concept review URLs being indexed | Medium | High | Canonical exclusion, sitemap exclusion, redirect or noindex policy | Phase 12 |
| Staging being indexed | Medium | High | Environment-specific robots rules, non-production blocking checks | Phases 12 and 16 |
| Production blocked by `robots.txt` | Low | Critical | Production robots review, crawl validation, deployment checklist | Phases 12 and 16 |
| `OAI-SearchBot` blocked | Medium | High | Explicit crawler policy, hosting and firewall review, robots validation | Phase 12 |
| Invalid sitemap | Medium | High | Generated sitemap validation, approved URL sources, pre-launch checks | Phase 12 |
| Invalid structured data | Medium | Medium | Structured-data builder, schema validation, visible-content matching | Phase 12 |
| Fake structured-data claims | Low | Critical | Verified-content-only rule, content approval gate, schema review | Phase 12 |
| Thin content | Medium | Medium | Search-intent and page-map approval before new pages are created | Phase 12 |
| Keyword stuffing | Medium | Medium | Editorial governance, visible-content review, message ownership | Phase 12 |
| Mobile content mismatch | Medium | High | Mobile parity validation, rendered HTML comparison, QA checks | Phase 13 |
| User-specific results being indexed | Low | Critical | Noindex and private-route policies, exclusion from sitemap, access review | Phases 9, 12, and 13 |
| Search visibility being treated as guaranteed | Medium | Medium | Explicit non-guarantee language in planning and reporting | Phase 0 |

## 23. Consolidated open decisions

Each decision appears only once.

- production email provider
- sender domain
- sender address
- internal contact recipient
- internal insight recipient
- whether to send user confirmation
- whether to attach the insight or include it in the email body
- CAPTCHA requirement
- retention period
- privacy-policy wording
- cookie-policy wording
- consent requirements
- consent requirements by target region
- email-template approval process
- whether message files are edited through Git only or through a future CMS
- whether form configuration is deployment-time or future admin-managed
- whether the generated insight is temporarily stored server-side
- whether the email endpoint receives a signed result token
- whether the result is regenerated for email
- whether only a summary or complete result is emailed
- how long a generated result remains available
- Consent Management Platform versus custom consent
- Google Tag Manager versus direct tags
- Google Analytics property
- Google Ads account and conversions
- Meta Business account and Pixel
- TikTok Ads account and Pixel
- final conversion definitions
- attribution model
- attribution lifetime
- first-touch versus last-touch
- Advanced Matching
- Enhanced conversions
- server-side tracking
- final domain
- Hebrew root versus `/he/`
- static generation, pre-rendering, or SSR
- approved indexable pages
- approved keyword targets
- public organization details
- About HUMA content
- knowledge section
- `GPTBot` allow or disallow
- Search Console ownership
- social images
- SEO monitoring frequency
- final LLM provider
- final LLM model
- crawlable rendering architecture approval

Rule:

- Do not resolve these decisions during Phase 0.

## 24. Final phase order

| Phase | Name | Main objective | Depends on |
| --- | --- | --- | --- |
| Phase 0 | Planning and Baseline | Confirm scope, authority, architecture, open decisions, assets, blockers, execution rules, and readiness for implementation planning | None |
| Phase 1 | Frontend Foundation | Establish shared app structure for concepts, routing, layout primitives, and implementation conventions | Phase 0 |
| Phase 2 | Messages, Content Schemas and Dynamic Form Definitions | Externalize all user-visible copy, define structured content schemas, and introduce dynamic public form definitions with validation metadata | Phase 1 |
| Phase 3 | Bilingual and Direction System | Implement RTL/LTR direction handling, language switching behavior, and bilingual rendering rules on top of the message layer | Phase 2 |
| Phase 4 | Concept A Implementation | Build the approved Concept A presentation on top of shared content, messages, and engines | Phase 3 |
| Phase 5 | Concept C Implementation | Build the approved Concept C presentation on top of shared content, messages, and engines | Phase 3 |
| Phase 6 | Concept Switching | Enable safe switching between concepts without duplicate logic, duplicate analytics, or duplicate canonicals | Phases 4-5 |
| Phase 7 | Dynamic Assessment Engine | Convert the assessment into a schema-driven interactive Quiz flow | Phases 2-3, 6 |
| Phase 8 | Secure LLM Integration | Add protected server-side organizational insight analysis and structured result generation | Phases 6-7 |
| Phase 9 | Dynamic Result Experience | Render structured insight results dynamically in Concept A and Concept C | Phases 7-8 |
| Phase 10 | Secure Email Integration | Implement secure form submission and email delivery through server-side endpoints and provider abstraction | Phases 2-3, 7, 9 |
| Phase 11 | Marketing Analytics, Campaign Attribution and Cookie Consent | Implement and verify consent-aware marketing measurement without exposing personal, Quiz, LLM, form, or email content | Phases 2-3, 7, 9-10 |
| Phase 12 | SEO, Google Search and AI Search Visibility | Make approved HUMA content crawlable, indexable, multilingual, semantically understandable, and eligible for Google Search and ChatGPT Search discovery | Phases 2-6, 11 |
| Phase 13 | Responsive, Accessibility and Full QA | Validate responsiveness, accessibility, bilingual behavior, concept parity, tracking safety, crawlability, and failure states | Phases 4-12 |
| Phase 14 | Final Concept Decision | Confirm the final production concept direction after QA evidence and stakeholder review | Phase 13 |
| Phase 15 | Git and GitHub | Prepare version-control workflow, commits, branch strategy, and PR readiness after implementation approval | Phase 14 |
| Phase 16 | Vercel Deployment | Configure production delivery only after implementation and review are complete | Phases 11-15.6 |

## 25. Phase-specific requirements

### Phase 4 — Concept A Implementation

Required evidence:

- Hebrew desktop screenshot at 1440px
- English desktop screenshot at 1440px
- Hebrew mobile screenshot at 390px
- English mobile screenshot at 390px
- Concept-to-render fidelity ledger
- No Concept C implementation changes during this phase

### Phase 5 — Concept C Implementation

Required evidence:

- Hebrew desktop screenshot at 1440px
- English desktop screenshot at 1440px
- Hebrew mobile screenshot at 390px
- English mobile screenshot at 390px
- Separate Concept-to-render fidelity ledger
- Evidence that Concept C is not Concept A with different colors

### Phase 7 — Dynamic Assessment Engine

Required deliverables:

- external Quiz definition
- schema-driven rendering
- dynamic number of questions
- conditional visibility
- branching
- validation
- persistence
- completion payload
- mock result
- Hebrew
- English
- Concept A
- Concept C

Explicit exclusion:

- No external LLM call

### Phase 8 — Secure LLM Integration

Required deliverables:

- secure server endpoint
- provider abstraction
- mock provider
- OpenAI provider
- Claude provider or documented deferred adapter
- external Hebrew prompt
- external English prompt
- prompt loader
- prompt composer
- request validation
- structured result schema
- result validation
- failure handling
- rate limiting
- prompt-injection protection

### Phase 9 — Dynamic Result Experience

Required deliverables:

- loading state
- structured success result
- retry state
- provider-failure state
- safe fallback
- Hebrew result
- English result
- Concept A presentation
- Concept C presentation
- safe email continuation

### Phase 11 — Marketing Analytics, Campaign Attribution and Cookie Consent

Required deliverables:

- analytics abstraction
- mock provider
- consent interface
- consent state
- attribution service
- event catalog
- provider mappings
- network verification

### Phase 12 — SEO, Google Search and AI Search Visibility

Required deliverables:

- crawlable rendering decision
- language URL strategy
- canonical rules
- `hreflang`
- `robots.txt`
- `sitemap.xml`
- localized metadata
- structured data
- `OAI-SearchBot` policy
- `GPTBot` decision documentation

## 26. Phase Execution Rules

1. Only one phase may be `IN PROGRESS`.
2. Do not start another phase without explicit user approval.
3. Do not perform work assigned to a later phase.
4. Every phase ends with validation evidence.
5. A successful build is not sufficient visual validation.
6. Visual phases require desktop and mobile screenshots.
7. Concept phases require comparison with approved PNG references.
8. Failures must be corrected inside the current phase.
9. Existing unrelated user changes must be preserved.
10. GitHub and deployment remain prohibited before their phases.
11. Real LLM, email, and tracking credentials remain prohibited until explicitly approved.
12. Update the Master Plan after every phase.
13. Stop after every phase and wait for approval.

## 27. Standard Phase Completion Report

Every phase must report:

- Phase name
- Objective
- Work completed
- Files created
- Files changed
- Files intentionally not changed
- Commands executed
- Build result
- TypeScript result
- Lint result
- Test result
- Browser verification
- Screenshots
- Fidelity comparison where applicable
- Known issues
- Intentional deviations
- Exit-criteria result
- Recommended status
- Confirmation that the next phase was not started

## 28. Phase status table

| Phase | Name | Status | Started | Completed | Evidence | Approval |
| --- | --- | --- | --- | --- | --- | --- |
| Phase 0 | Planning and Baseline | COMPLETED | — | 2026-08-17 | Master Plan updated; assets inspected; blockers recorded | User approved |
| Phase 1 | Frontend Foundation | COMPLETED | 2026-08-17 | 2026-08-17 | Minimal app foundation added; build passed; browser verification artifacts saved under `docs/implementation/validation/` | User approved |
| Phase 2 | Messages, Content Schemas and Dynamic Form Definitions | COMPLETED | 2026-08-17 | 2026-08-17 | Message catalogs, content schemas, dynamic form definitions, validation artifacts, and browser evidence saved under `docs/implementation/validation/phase-2/` | User approved |
| Phase 3 | Bilingual and Direction System | COMPLETED | 2026-08-17 | 2026-08-17 | Localized routes, language switching, document-level direction, terminology, validation artifacts, and browser evidence saved under `docs/implementation/validation/phase-3/` | User approved |
| Phase 4 | Concept A Implementation | COMPLETED | 2026-08-17 | 2026-08-18 | Concept A implementation completed on shared architecture; final overlap report, fidelity ledger, targeted Insight correction report, targeted localized Contact anchor correction report, and validation screenshots saved under `docs/implementation/validation/phase-4/` | User approved |
| Phase 5 | Concept C Implementation | COMPLETED | 2026-08-18 | 2026-08-19 | Concept C implementation completed on shared architecture, including a same-day fidelity correction to the hero, Problem/Insight, and Capabilities/Method sections; separate fidelity ledger, browser check JSON, and desktop/mobile screenshots saved under `docs/implementation/validation/phase-5/` | User approved |
| Phase 6 | Concept Switching | COMPLETED | 2026-08-19 | 2026-08-19 | Concept switching (localStorage persistence, internal review switcher, Quiz-state preservation) implemented and verified; report and browser check evidence saved under `docs/implementation/validation/phase-6/` | User approved |
| Phase 7 | Dynamic Assessment Engine | COMPLETED | 2026-08-19 | 2026-08-19 | Schema-driven Quiz engine (conditional visibility, branching, real validation, persistence, completion payload, mock result) implemented and verified; report and browser/engine check evidence saved under `docs/implementation/validation/phase-7/` | User approved |
| Phase 8 | Secure LLM Integration | COMPLETED | 2026-08-19 | 2026-08-19 | Secure endpoint, provider abstraction (mock/OpenAI/Claude), external prompts, request/result validation, rate limiting, and prompt-injection protection implemented and verified without any real network call to OpenAI/Claude; report and evidence saved under `docs/implementation/validation/phase-8/` | User approved |
| Phase 9 | Dynamic Result Experience | COMPLETED | 2026-08-19 | 2026-08-19 | Live API integration, loading/retry/fallback states, and dynamic result rendering implemented and verified in both concepts and languages; a pre-existing Phase 4 CSS bug (empty focus-items list) was found and fixed; report and evidence saved under `docs/implementation/validation/phase-9/` | User approved |
| Phase 10 | Secure Email Integration | COMPLETED | 2026-08-19 | 2026-08-19 | Secure `/api/contact` and `/api/insight/deliver` endpoints, mock + generic SMTP provider abstraction, versioned templates, honeypot spam protection, and real form submission implemented and verified without sending any real email; report and evidence saved under `docs/implementation/validation/phase-10/` | User approved |
| Phase 11 | Marketing Analytics, Campaign Attribution and Cookie Consent | COMPLETED | 2026-08-19 | 2026-08-19 | Event catalog, provider abstraction (mock + real Google/Meta/TikTok, all disabled by default), consent-aware tracking chokepoint, cookie consent banner, and campaign attribution implemented and verified with zero real tracking requests ever sent; report and evidence saved under `docs/implementation/validation/phase-11/` | User approved |
| Phase 12 | SEO, Google Search and AI Search Visibility | COMPLETED | 2026-08-20 | 2026-08-20 | Build-time pre-rendering, canonical/hreflang/localized metadata, robots.txt (OAI-SearchBot and GPTBot explicitly allowed), sitemap.xml, and home-page structured data implemented and verified via a non-JS HTTP fetch against real build output; report and evidence saved under `docs/implementation/validation/phase-12/` | User approved |
| Phase 13 | Responsive, Accessibility and Full QA | COMPLETED | 2026-08-20 | 2026-08-20 | Full QA sweep across Phases 4-12 (responsiveness, axe-core accessibility, bilingual/RTL-LTR, concept parity, tracking safety, crawlability, failure states); 3 real accessibility defects found and fixed (button contrast, duplicate nav landmarks, missing page heading); final sweep shows zero violations and zero real tracking requests; report and evidence saved under `docs/implementation/validation/phase-13/` | User approved |
| Phase 14 | Final Concept Decision | COMPLETED | 2026-08-20 | 2026-08-20 | User reviewed Phase 13 QA evidence and selected **Concept A** as the final production concept; `siteConfig.defaultConcept` already matched, no code change required; Concept C retained in the codebase per explicit user decision; report and evidence saved under `docs/implementation/validation/phase-14/` | User approved |
| Phase 15 | Git and GitHub | READY FOR REVIEW | 2026-08-20 | 2026-08-20 | Repository initialized, `.gitignore` reviewed and hardened, stray build artifacts removed, README added, clean initial commits created on `main`, `origin` remote configured; the actual `git push` is a manual step for the user to run in an interactive terminal (Windows Credential Manager needs an interactive prompt this tool's non-interactive shell cannot provide); report and evidence saved under `docs/implementation/validation/phase-15/` | Pending user review |
| Phase 15.5 | Concept D Implementation and Default Selection | READY FOR REVIEW | 2026-08-20 | 2026-08-20 | Structural photo-led Concept D implemented without changing site structure; four image assets persisted; `defaultConcept` set to `"d"`; Hebrew/English desktop/mobile QA passed; evidence saved under `docs/implementation/validation/phase-15.5/` | Pending user review |
| Phase 15.6 | Brevo Transactional Email Integration | READY FOR REVIEW | 2026-08-22 | 2026-08-23 | Direct server-side Brevo provider, sandbox-first configuration, no-network validation, regression coverage, and credential-template correction completed; evidence saved under `docs/implementation/validation/phase-15.6/` | Pending user review |
| Phase 16 | Vercel Deployment | NOT STARTED | — | — | — | Not approved |

Allowed statuses:

- `NOT STARTED`
- `IN PROGRESS`
- `BLOCKED`
- `READY FOR REVIEW`
- `APPROVED`
- `COMPLETED`

Rule:

- Only the user may approve Phase 0.

## 29. Definition of Done

The final Definition of Done must include:

- Concept A implemented and verified
- Concept C implemented and verified
- production concept selected
- Concept D implemented, verified, and selected as the current default
- Hebrew complete
- English complete
- RTL verified
- LTR verified
- all visible text loaded from external messages
- dynamic forms verified
- dynamic Quiz verified
- secure OpenAI and Claude provider architecture verified
- external Hebrew and English prompts verified
- structured result verified
- secure email verified
- consent verified
- marketing tracking verified
- campaign attribution verified
- crawlable content verified
- Google Search requirements verified
- ChatGPT Search crawler policy verified
- accessibility verified
- responsive behavior verified
- GitHub publication completed
- Vercel production deployment verified

Additional Definition of Done checks:

- important content exists in crawlable HTML
- canonical URLs are correct
- `hreflang` is correct
- `robots.txt` is validated
- `sitemap.xml` is valid
- structured data matches visible content
- concept URLs are not indexed
- user-specific results are not indexed
- no prohibited data appears in marketing payloads
- marketing scripts do not materially damage performance

## 30. Deferred decisions and later-phase blockers

- Phase 14's historical final-concept decision selected Concept A. That decision was explicitly superseded by the user's later Phase 15.5 approval on `2026-08-20`.
- Current implementation concept: **Concept D**. Concept A and Concept C remain retained in the codebase as preview options; `siteConfig.defaultConcept` is now `"d"`.
- Final LLM provider and model remain unresolved. This is a Phase 8 decision.
- Crawlable rendering strategy remains unresolved. This is a Phase 12 decision.
- Final domain, public language root decision, and Search Console ownership remain unresolved. This is a Phase 12 and Phase 16 decision.
- Public organization facts needed for final SEO and structured data remain unresolved. This is a Phase 12 content requirement.
- Consent wording, cookie wording, and region-specific privacy requirements remain unresolved. This is a Phase 11 decision.

## 31. Phase 1 execution record

### Confirmed baseline before Phase 1 edits

- Confirmed framework: React + Vite + TypeScript.
- Confirmed package manager: npm with `package-lock.json`.
- Confirmed styling method: global `src/styles.css` plus the existing Vite Tailwind plugin and the existing utility-class usage already present in the codebase.
- Confirmed routing method: `react-router-dom` with `BrowserRouter`, `/`, and `/insight`.
- Confirmed entry ownership before edits: `src/main.tsx` mounted the app and also owned routing; `src/App.tsx` owned route composition.
- Confirmed layout ownership before edits: `src/components/SiteLayout.tsx`.
- Confirmed page ownership before edits: `src/pages/HomePage.tsx` and `src/pages/InsightPage.tsx`.
- Confirmed current `public/` directory status: no `public/` directory was present during inspection.
- Confirmed test tooling status: no test framework, no test files, and no test script were present in the inspected workspace.
- Confirmed lint tooling status: no lint script and no ESLint configuration were present in the inspected workspace.
- Confirmed baseline validation before edits: `npm.cmd run build` succeeded and the local Vite dev server responded on `http://127.0.0.1:4173/`.

### Phase 1 implementation outcome

- Preserved existing HUMA content, existing pages, existing components, existing styling, and all saved concept assets.
- Preserved the existing React + Vite + TypeScript stack.
- Added clear app-level ownership for providers, route composition, public frontend config, and safe top-level failure handling.
- Kept `src/components/SiteLayout.tsx` as the application shell owner instead of creating a competing shell abstraction.
- Kept current routes limited to `/` and `/insight`.
- Did not implement messages, i18n files, concept switching, dynamic forms, dynamic Quiz, analytics, cookie consent, SEO routes, server APIs, or any Phase 2+ feature.

Final Phase 1 folder structure created or confirmed:

```text
src/
  app/
    AppProviders.tsx
    AppRoutes.tsx
  components/
    ContactForm.tsx
    SectionIntro.tsx
    SiteLayout.tsx
  config/
    site.ts
  content/
    siteContent.ts
  pages/
    HomePage.tsx
    InsightPage.tsx
  shared/
    components/
      AppErrorBoundary.tsx
  App.tsx
  main.tsx
  styles.css
```

Files created in Phase 1:

- `src/app/AppProviders.tsx`
- `src/app/AppRoutes.tsx`
- `src/config/site.ts`
- `src/shared/components/AppErrorBoundary.tsx`
- `docs/implementation/validation/phase1-home-desktop.png`
- `docs/implementation/validation/phase1-insight-desktop.png`
- `docs/implementation/validation/phase1-home-mobile.png`
- `docs/implementation/validation/phase1-console-check.cjs`
- `docs/implementation/validation/phase1-console-check.json`

Files changed in Phase 1:

- `src/App.tsx`
- `src/main.tsx`
- `docs/implementation/huma-website-master-plan.md`

Files intentionally not changed in Phase 1:

- `src/pages/HomePage.tsx`
- `src/pages/InsightPage.tsx`
- `src/components/SiteLayout.tsx`
- `src/components/ContactForm.tsx`
- `src/content/siteContent.ts`
- `src/styles.css`
- all Concept A, Concept B, and Concept C PNG files
- all design-concept documentation

Target directories intentionally not materialized yet:

- `src/shared/forms/`
- `src/shared/assessment/`
- `src/shared/hooks/`
- `src/shared/schemas/`
- `src/shared/utilities/`
- `src/concepts/concept-a/`
- `src/concepts/concept-c/`
- `src/i18n/`

Reason:

- These remain planned Phase 2+ ownership areas, but creating empty placeholders in Phase 1 would not add maintainable value.

### Validation and browser verification

Commands executed during Phase 1:

- `npm.cmd run build`
- `Invoke-WebRequest -UseBasicParsing http://127.0.0.1:4173/`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1600" --full-page --wait-for-selector "main" --wait-for-timeout 1500 "http://127.0.0.1:4173/" "docs/implementation/validation/phase1-home-desktop.png"`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1600" --full-page --wait-for-selector "main" --wait-for-timeout 1500 "http://127.0.0.1:4173/insight" "docs/implementation/validation/phase1-insight-desktop.png"`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "390,844" --full-page --wait-for-selector "main" --wait-for-timeout 1500 "http://127.0.0.1:4173/" "docs/implementation/validation/phase1-home-mobile.png"`
- `node docs/implementation/validation/phase1-console-check.cjs`

Validation results:

- Build result: passed.
- TypeScript result: passed through `tsc -b` inside `npm.cmd run build`.
- Lint result: unavailable because no lint script or ESLint configuration is currently present.
- Test result: unavailable because no test script or test framework is currently present.
- Dev server result: passed with HTTP `200` from `http://127.0.0.1:4173/`.

Browser verification method:

- Browser plugin was not available.
- Screenshot fallback used Playwright CLI with system Microsoft Edge.
- Console and page-health verification used a read-only headless Edge CDP check saved to `docs/implementation/validation/phase1-console-check.json`.

Saved browser evidence:

- Desktop home screenshot: `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase1-home-desktop.png`
- Desktop insight screenshot: `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase1-insight-desktop.png`
- Mobile home screenshot: `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase1-home-mobile.png`
- Console and page-health report: `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase1-console-check.json`

Verified browser results from the saved report:

- Homepage loaded with non-empty content.
- Insight page loaded with non-empty content.
- `main` was present on both routes.
- No Vite error overlay was present.
- No horizontal overflow was detected on the checked routes.
- No console warnings or console errors were recorded by the saved check.

### Deferred decisions retained after Phase 1

- Concept A missing section references remain a Phase 4 blocker only.
- Final production concept remains a Phase 14 decision.
- LLM provider and model remain a Phase 8 decision.
- Crawlable rendering strategy remains a Phase 12 decision.
- Domain and language-root strategy remain a Phase 12 and Phase 16 decision.
- Organization facts for SEO remain a Phase 12 content requirement.
- Consent and privacy wording remain a Phase 11 decision.

### Phase 1 exit-criteria result

- Existing application still runs.
- Production build succeeds.
- TypeScript succeeds.
- Lint is not configured and has been evidenced as unavailable rather than claimed as passed.
- Tests are not configured and have been evidenced as unavailable rather than claimed as passed.
- Desktop baseline works.
- Mobile baseline works.
- Existing HUMA content is preserved.
- Existing visual output is preserved.
- Concept assets are preserved.
- Foundation ownership is clearer after the Phase 1 changes.
- No later-phase feature was implemented.
- No secrets were created.
- Git was not modified.
- Deployment was not performed.

Recommended Phase 1 status:

- `READY FOR REVIEW`

## 32. Phase 2 execution record

### Confirmed scope and guardrails for Phase 2

- Phase 1 remained approved and treated as completed before Phase 2 implementation work continued.
- Work remained strictly limited to messages, content schemas, dynamic quiz definition, dynamic contact-form definition, dynamic insight-email definition, typed message access, runtime validation, and structural parity validation.
- No visual redesign was performed.
- No Phase 3 or later capability was started.
- No deployment, publication, Git initialization, LLM integration, email delivery integration, or tracking integration was performed.

### Complete content inventory outcome

- A complete user-visible copy inventory was extracted from the Phase 1 application before migration.
- The saved inventory record is `docs/implementation/validation/phase-2/phase2-content-inventory.md`.
- Original inspected ownership sources were:
  - `src/content/siteContent.ts`
  - `src/pages/HomePage.tsx`
  - `src/pages/InsightPage.tsx`
  - `src/components/ContactForm.tsx`
  - `src/components/SiteLayout.tsx`
  - `src/shared/components/AppErrorBoundary.tsx`
- The inventory confirms that all current visible homepage, insight-page, form, footer, and system copy groups were extracted into message files and schema references.

### Phase 2 implementation outcome

- Added centralized message catalogs for Hebrew and English domain parity.
- Added typed message access and runtime catalog-shape validation.
- Added a schema-backed site-structure model for homepage sections, footer copy, and section-level message references.
- Added a schema-backed assessment definition for Organizational Insight questions, helpers, options, and result references.
- Added schema-backed definitions for the contact form and the insight email form.
- Added shared dynamic form rendering and shared runtime validation.
- Migrated the current homepage, insight page, layout shell, contact form, and error boundary to message-backed and schema-backed rendering.
- Preserved the currently visible Hebrew website output and current RTL behavior.
- Reserved Phase 2 message domains for future cookie-consent, privacy, and SEO work without implementing those later-phase features.

### Authoritative Phase 2 files created

- Message catalogs:
  - `messages/he/common.json`
  - `messages/he/navigation.json`
  - `messages/he/homepage.json`
  - `messages/he/assessment.json`
  - `messages/he/insight-result.json`
  - `messages/he/contact-form.json`
  - `messages/he/validation.json`
  - `messages/he/system.json`
  - `messages/he/cookie-consent.json`
  - `messages/he/privacy.json`
  - `messages/he/seo.json`
  - `messages/en/common.json`
  - `messages/en/navigation.json`
  - `messages/en/homepage.json`
  - `messages/en/assessment.json`
  - `messages/en/insight-result.json`
  - `messages/en/contact-form.json`
  - `messages/en/validation.json`
  - `messages/en/system.json`
  - `messages/en/cookie-consent.json`
  - `messages/en/privacy.json`
  - `messages/en/seo.json`
- Content and form schemas:
  - `content/site-structure.json`
  - `content/assessment.json`
  - `forms/contact-form.json`
  - `forms/insight-email-form.json`
- Shared runtime and rendering support:
  - `src/i18n/messages.ts`
  - `src/content/siteStructure.ts`
  - `src/shared/assessment/assessmentCatalog.ts`
  - `src/shared/forms/formCatalog.ts`
  - `src/shared/forms/validation.ts`
  - `src/shared/forms/DynamicForm.tsx`
- Validation artifacts:
  - `scripts/validate-phase2.mjs`
  - `docs/implementation/validation/phase-2/phase2-content-inventory.md`
  - `docs/implementation/validation/phase-2/phase2-validation-report.json`
  - `docs/implementation/validation/phase-2/phase2-hardcoded-copy-report.json`
  - `docs/implementation/validation/phase-2/phase2-console-check.cjs`
  - `docs/implementation/validation/phase-2/phase2-console-check.json`
  - `docs/implementation/validation/phase-2/phase2-home-desktop.png`
  - `docs/implementation/validation/phase-2/phase2-home-mobile.png`
  - `docs/implementation/validation/phase-2/phase2-insight-desktop.png`
  - `docs/implementation/validation/phase-2/phase2-contact-form.png`

### Existing files changed in Phase 2

- `package.json`
- `src/components/ContactForm.tsx`
- `src/components/SiteLayout.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/InsightPage.tsx`
- `src/shared/components/AppErrorBoundary.tsx`
- `docs/implementation/huma-website-master-plan.md`

### Files intentionally not changed in Phase 2

- `src/styles.css`
- `src/App.tsx`
- `src/main.tsx`
- `src/app/AppProviders.tsx`
- `src/app/AppRoutes.tsx`
- `src/components/SectionIntro.tsx`
- all saved Concept A, Concept B, and Concept C PNG concept images
- all design-exploration documents outside the new Phase 2 validation artifacts

### Message ownership and parity rules established in Phase 2

- Hebrew in `messages/he/` is the authoritative source for current visible copy.
- English in `messages/en/` mirrors the full Hebrew key tree for structural parity validation only.
- English values were intentionally not finalized in Phase 2 and are not rendered in the UI.
- Every public schema and form definition references message keys through domain-qualified refs.
- Runtime validation enforces message-domain parity and rejects missing Hebrew leaves.

### Validation approach implemented in Phase 2

- `scripts/validate-phase2.mjs` validates:
  - structural parity between `messages/he/` and `messages/en/`
  - non-empty required Hebrew message leaves
  - interpolation-token parity between Hebrew and English catalogs
  - existence of all message refs used by public schemas
  - duplicate question and option protection in the assessment definition
  - duplicate field protection and approved routing IDs in form definitions
  - absence of public secret-like tokens in exported JSON definitions
  - hardcoded user-visible copy exceptions in `src/`
- `src/i18n/messages.ts` validates catalog shape at runtime before message access.

### Commands executed for Phase 2

- `npm.cmd run build`
- `npm.cmd run validate:content`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1600" --full-page --wait-for-selector "main" --wait-for-timeout 1500 "http://127.0.0.1:4173/" "D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-2\phase2-home-desktop.png"`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1600" --full-page --wait-for-selector "main" --wait-for-timeout 1500 "http://127.0.0.1:4173/insight" "D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-2\phase2-insight-desktop.png"`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "390,844" --full-page --wait-for-selector "main" --wait-for-timeout 1500 "http://127.0.0.1:4173/" "D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-2\phase2-home-mobile.png"`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1600" --full-page --wait-for-selector "form" --wait-for-timeout 1500 "http://127.0.0.1:4173/#contact" "D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-2\phase2-contact-form.png"`
- `node docs/implementation/validation/phase-2/phase2-console-check.cjs`

### Validation results

- Build result: passed.
- TypeScript result: passed through `tsc -b` inside `npm.cmd run build`.
- Lint result: unavailable because no lint script or ESLint configuration is currently present.
- Test result: unavailable because no test script or test framework is currently present.
- Content validation result: passed.
- Message validation result: passed.
- Content-schema validation result: passed with `184` referenced message refs resolved.
- Quiz validation result: passed.
- Form validation result: passed.
- Hardcoded copy exception report: passed with `[]`.

### Browser verification and saved evidence

- Browser plugin was not available.
- Browser fallback used Playwright CLI with system Microsoft Edge.
- Console and page-health verification used a read-only headless Edge check saved to `docs/implementation/validation/phase-2/phase2-console-check.json`.
- Saved screenshots:
  - `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-2\phase2-home-desktop.png`
  - `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-2\phase2-home-mobile.png`
  - `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-2\phase2-insight-desktop.png`
  - `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-2\phase2-contact-form.png`
- Verified browser results from the saved report:
  - homepage loaded with non-empty content and `main`
  - insight page loaded with non-empty content and `main`
  - contact route state contained a rendered form
  - no Vite error overlay was present
  - no horizontal overflow was detected on checked routes
  - no console warnings or console errors were recorded

### Deferred limitations intentionally retained after Phase 2

- English copy is structurally scaffolded but not authored for public rendering yet.
- Form submission remains local-only and intentionally does not send email or external requests in Phase 2.
- Cookie consent, privacy execution, analytics, SEO indexing work, and public search work remain deferred to later approved phases.
- No concept redesign or visual restyling was introduced in this phase.

### Phase 2 exit-criteria result

- Existing application still runs.
- Production build succeeds.
- TypeScript succeeds.
- Lint is not configured and has been evidenced as unavailable rather than claimed as passed.
- Tests are not configured and have been evidenced as unavailable rather than claimed as passed.
- All visible Hebrew content is now sourced through external message catalogs.
- Shared public content structure is schema-backed.
- The Organizational Insight quiz definition is schema-backed.
- The contact form and insight email form definitions are schema-backed.
- Typed message access is implemented.
- Runtime validation is implemented.
- Structural parity validation is implemented.
- Existing visible Hebrew output is preserved.
- Existing concept assets are preserved.
- No Phase 3 or later work was started.
- No secrets were created.
- Git was not initialized or modified as part of this phase.
- Deployment was not performed.

Recommended Phase 2 status:

- `READY FOR REVIEW`

## 33. Phase 3 execution record

### Confirmed scope and guardrails for Phase 3

- Phase 2 is treated as completed based on explicit user approval.
- Work remained limited to bilingual behavior, localized routes, language switching, document-level `lang` and `dir`, persistence, terminology, bilingual forms, bilingual Organizational Insight content, and language validation.
- No Concept A implementation, no Concept C implementation, no concept switcher, no LLM integration, no email delivery integration, no analytics, and no deployment work were started.
- Existing visual design, color system, typography system, section composition, and overall layout were preserved.

### Baseline findings recorded before implementation

- The saved Phase 3 baseline report is `docs/implementation/validation/phase-3/phase3-baseline-report.md`.
- Baseline findings confirmed:
  - English message values were incomplete across all rendered domains.
  - The application was Hebrew-only in routing and default language assumptions.
  - `index.html` hardcoded `lang="he"` and `dir="rtl"`.
  - Navigation and challenge-button alignment still contained explicit RTL assumptions.
  - No language persistence or localized route architecture existed.

### Final language architecture

- A shared language system was created in `src/i18n/language.tsx`.
- Supported languages are:
  - `he`
  - `en`
- Default language remains `he`.
- The language system now owns:
  - current language resolution
  - current direction resolution
  - localized route generation
  - route-language parsing
  - query-language normalization
  - explicit language switching
  - local persistence through the stable storage key `huma-language`
  - document-level `lang`
  - document-level `dir`
  - localized title updates
- `index.html` now includes an early path-aware bootstrap script so direct localized entry sets `lang` and `dir` before hydration.

### Final localized route behavior

- Implemented localized route form:
  - `/he`
  - `/he/insight`
  - `/en`
  - `/en/insight`
- Chosen normalized route form:
  - no trailing slash normalization in the router implementation
- Safe compatibility routes now redirect as follows:
  - `/` → `/he`
  - `/insight` → `/he/insight`
- Query-parameter normalization now redirects:
  - `?lang=he` → equivalent Hebrew localized route
  - `?lang=en` → equivalent English localized route
- Invalid or unsupported routes now redirect safely to the stored language when available, otherwise to the Hebrew default.

### Persistence precedence

- Stable storage key:
  - `huma-language`
- Implemented precedence:
  - valid localized URL
  - valid explicit `?lang=` normalization or language-switcher selection
  - stored language preference
  - Hebrew default
- Compatibility routes `/` and `/insight` remain fixed Hebrew redirects unless a valid `?lang=` override is present, per the approved Phase 3 requirement.

### Terminology record

- The approved bilingual terminology document was created at:
  - `docs/content/terminology.md`
- It covers at least:
  - HUMA Labs
  - HUMA Organizational Insight
  - Presence
  - Resilience
  - Adaptability
  - Leadership
  - Discover
  - Design
  - Act
  - organizational challenge
  - human capability
  - organizational capability
  - leadership development
  - employee development
  - organizational needs assessment
  - organizational outcome
  - delivery format

### English translation outcome

- All English message files for the currently rendered website are now complete.
- English preserves the meaning and scope of the Hebrew source and does not add unapproved claims, services, results, proof, or credentials.
- English translation review evidence was saved to:
  - `docs/implementation/validation/phase-3/phase3-translation-review.md`
- Reserved `cookie-consent` and `privacy` message domains remain structurally present and intentionally un-authored because their implementation belongs to later approved phases.

### Bilingual rendering outcome

- The homepage now renders in both Hebrew and English from the same shared page component.
- The Organizational Insight page now renders in both Hebrew and English from the same shared page component.
- The contact form and the insight email form now render in both languages from the same shared dynamic form renderer.
- Validation messages now resolve from localized message files in both languages.
- Mixed-direction inputs now behave correctly:
  - work email fields render with LTR direction
  - future telephone-capable fields are prepared for LTR direction
  - other text fields inherit the selected document direction

### Files created in Phase 3

- `src/i18n/language.tsx`
- `scripts/validate-phase3.mjs`
- `docs/content/terminology.md`
- `docs/implementation/validation/phase-3/phase3-baseline-report.md`
- `docs/implementation/validation/phase-3/phase3-validation-report.json`
- `docs/implementation/validation/phase-3/phase3-language-audit.json`
- `docs/implementation/validation/phase-3/phase3-translation-review.md`
- `docs/implementation/validation/phase-3/phase3-console-check.cjs`
- `docs/implementation/validation/phase-3/phase3-console-check.json`
- `docs/implementation/validation/phase-3/phase3-home-he-desktop.png`
- `docs/implementation/validation/phase-3/phase3-home-en-desktop.png`
- `docs/implementation/validation/phase-3/phase3-home-he-mobile.png`
- `docs/implementation/validation/phase-3/phase3-home-en-mobile.png`
- `docs/implementation/validation/phase-3/phase3-insight-he-desktop.png`
- `docs/implementation/validation/phase-3/phase3-insight-en-desktop.png`
- `docs/implementation/validation/phase-3/phase3-insight-he-mobile.png`
- `docs/implementation/validation/phase-3/phase3-insight-en-mobile.png`
- `docs/implementation/validation/phase-3/phase3-contact-he.png`
- `docs/implementation/validation/phase-3/phase3-contact-en.png`

### Existing files changed in Phase 3

- `index.html`
- `package.json`
- `forms/contact-form.json`
- `forms/insight-email-form.json`
- `messages/he/common.json`
- `messages/he/navigation.json`
- `messages/he/system.json`
- `messages/en/common.json`
- `messages/en/navigation.json`
- `messages/en/homepage.json`
- `messages/en/assessment.json`
- `messages/en/insight-result.json`
- `messages/en/contact-form.json`
- `messages/en/validation.json`
- `messages/en/system.json`
- `messages/en/seo.json`
- `src/config/site.ts`
- `src/app/AppProviders.tsx`
- `src/app/AppRoutes.tsx`
- `src/components/SectionIntro.tsx`
- `src/components/SiteLayout.tsx`
- `src/content/siteContent.ts`
- `src/i18n/messages.ts`
- `src/pages/HomePage.tsx`
- `src/pages/InsightPage.tsx`
- `src/shared/components/AppErrorBoundary.tsx`
- `src/shared/forms/DynamicForm.tsx`
- `src/styles.css`
- `docs/implementation/huma-website-master-plan.md`

### Files intentionally not changed in Phase 3

- `src/App.tsx`
- `src/main.tsx`
- `src/app/AppRoutes.tsx` route scope was changed only for localization, not for new page creation
- `content/assessment.json` stable quiz structure was preserved from Phase 2
- `content/site-structure.json` stable content IDs and message refs were preserved from Phase 2
- all approved Concept A, Concept B, and Concept C reference images
- all concept-exploration documents outside the Phase 3 validation artifacts

### Visible adjustments introduced in Phase 3

- Added a compact language selector to the shared header.
- Replaced explicit right-alignment assumptions with logical start alignment in reusable text wrappers.
- Added direction-aware input handling for mixed-direction fields in dynamic forms.
- Added initial document-language bootstrap behavior on localized direct entry.
- No visual redesign, palette change, typography change, or section-reordering change was introduced.

### Commands executed for Phase 3

- `npm.cmd run build`
- `npm.cmd run validate:content`
- `npm.cmd run validate:language`
- `node docs/implementation/validation/phase-3/phase3-console-check.cjs`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1600" --full-page --wait-for-selector "main" --wait-for-timeout 1500 "http://127.0.0.1:4173/he" "D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-home-he-desktop.png"`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1600" --full-page --wait-for-selector "main" --wait-for-timeout 1500 "http://127.0.0.1:4173/en" "D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-home-en-desktop.png"`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "390,844" --full-page --wait-for-selector "main" --wait-for-timeout 1500 "http://127.0.0.1:4173/he" "D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-home-he-mobile.png"`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "390,844" --full-page --wait-for-selector "main" --wait-for-timeout 1500 "http://127.0.0.1:4173/en" "D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-home-en-mobile.png"`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1600" --full-page --wait-for-selector "main" --wait-for-timeout 1500 "http://127.0.0.1:4173/he/insight" "D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-insight-he-desktop.png"`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1600" --full-page --wait-for-selector "main" --wait-for-timeout 1500 "http://127.0.0.1:4173/en/insight" "D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-insight-en-desktop.png"`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "390,844" --full-page --wait-for-selector "main" --wait-for-timeout 1500 "http://127.0.0.1:4173/he/insight" "D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-insight-he-mobile.png"`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "390,844" --full-page --wait-for-selector "main" --wait-for-timeout 1500 "http://127.0.0.1:4173/en/insight" "D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-insight-en-mobile.png"`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1600" --full-page --wait-for-selector "form" --wait-for-timeout 1500 "http://127.0.0.1:4173/he#contact" "D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-contact-he.png"`
- `npx.cmd playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1600" --full-page --wait-for-selector "form" --wait-for-timeout 1500 "http://127.0.0.1:4173/en#contact" "D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-contact-en.png"`

### Validation results

- Build result: passed.
- TypeScript result: passed through `tsc -b` inside `npm.cmd run build`.
- Lint result: unavailable because no lint script or ESLint configuration is currently present.
- Test result: unavailable because no test script or test framework is currently present.
- Content validation result: passed.
- Language validation result: passed.
- Quiz validation result: passed.
- Form validation result: passed.
- Language audit result: passed with `7` technical exceptions and `0` user-visible exceptions.

### Browser verification and saved evidence

- Browser plugin was not available.
- Browser fallback used Playwright CLI with system Microsoft Edge.
- Console and route-health verification used a read-only headless Edge check saved to `docs/implementation/validation/phase-3/phase3-console-check.json`.
- Saved bilingual regression screenshots:
  - `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-home-he-desktop.png`
  - `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-home-en-desktop.png`
  - `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-home-he-mobile.png`
  - `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-home-en-mobile.png`
  - `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-insight-he-desktop.png`
  - `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-insight-en-desktop.png`
  - `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-insight-he-mobile.png`
  - `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-insight-en-mobile.png`
  - `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-contact-he.png`
  - `D:\alexp\HumaLab Projects\huma-labs-site\docs\implementation\validation\phase-3\phase3-contact-en.png`
- Verified browser results from the saved report:
  - Hebrew homepage loads and renders with `lang="he"` and `dir="rtl"`
  - English homepage loads and renders with `lang="en"` and `dir="ltr"`
  - Hebrew Insight loads and renders with `lang="he"` and `dir="rtl"`
  - English Insight loads and renders with `lang="en"` and `dir="ltr"`
  - legacy `/` redirects to `/he`
  - legacy `/insight` redirects to `/he/insight`
  - language switch preserves the equivalent page between Hebrew and English Insight
  - browser back and forward work across localized Insight transitions
  - refresh on a localized Insight route preserves localized rendering
  - no Vite error overlay was present
  - no horizontal overflow was detected
  - no console warnings or console errors were recorded

### Known issues and deferred decisions retained after Phase 3

- Lint tooling is still unavailable in the current repository.
- Test tooling is still unavailable in the current repository.
- Cookie consent copy and implementation remain deferred to Phase 11.
- Privacy copy and implementation remain deferred to Phase 11.
- SEO strategy, canonicalization, `hreflang`, sitemap, robots, metadata targeting, and crawlability policy remain deferred to Phase 12.
- Dynamic Quiz runtime, branching execution, and answer persistence remain deferred to Phase 7.
- Dynamic LLM-backed results remain deferred to Phases 8 and 9.
- Secure email submission remains deferred to Phase 10.
- Final deployment routing rules for localized history fallback remain a Phase 16 concern.

### Phase 3 exit-criteria result

- Hebrew is complete for the currently rendered website.
- English is complete for the currently rendered website.
- English preserves the meaning of the Hebrew source.
- `/he` works.
- `/en` works.
- Hebrew Insight works.
- English Insight works.
- Legacy routes redirect safely.
- Language switching preserves the equivalent page.
- Document `lang` changes correctly.
- Document `dir` changes correctly.
- RTL works.
- LTR works.
- Dynamic forms render in both languages.
- Quiz messages resolve in both languages.
- Current result content renders in both languages.
- No user-visible copy remains hardcoded in application source.
- No missing keys appear in validation.
- Build passes.
- TypeScript passes.
- Language validation passes.
- Desktop verification passes.
- Mobile verification passes.
- No horizontal overflow was detected.
- No Phase 4 or later work was started.
- No LLM call was added to the application.
- No email delivery was added.
- No marketing script was installed.
- Git publication work was not started.
- Deployment was not performed.

Recommended Phase 3 status:

- `READY FOR REVIEW`

## 34. Phase 4 execution record

### Confirmed scope and guardrails for Phase 4

- User explicitly approved Phase 4 Concept A implementation on `2026-08-17`.
- Work remained limited to the approved Concept A presentation layer on top of the shared content, messages, routes, dynamic forms, and assessment flow.
- No Phase 5 or later implementation work was started.
- No packages were installed.
- Git publication work was not started.
- Deployment was not performed.

### Files created in Phase 4

- `src/concepts/concept-a/components/ConceptABrand.tsx`
- `src/concepts/concept-a/components/ConceptAFooter.tsx`
- `src/concepts/concept-a/components/ConceptAHeader.tsx`
- `src/concepts/concept-a/components/ConceptASectionHeading.tsx`
- `src/concepts/concept-a/components/ConceptAThread.tsx`
- `src/concepts/concept-a/sections/HomeHeroSection.tsx`
- `src/concepts/concept-a/sections/ProblemInsightSection.tsx`
- `src/concepts/concept-a/sections/InsightOverviewSection.tsx`
- `src/concepts/concept-a/sections/CapabilitiesMethodSection.tsx`
- `src/concepts/concept-a/sections/ChallengesFormatsSection.tsx`
- `src/concepts/concept-a/sections/OutcomesContactSection.tsx`
- `src/concepts/concept-a/sections/InsightQuestionFlowSection.tsx`
- `src/concepts/concept-a/sections/InsightResultSection.tsx`
- `docs/implementation/validation/phase-4/concept-a-design-system.md`
- `docs/implementation/validation/phase-4/concept-a-fidelity-ledger.md`
- `docs/implementation/validation/phase-4/home-desktop.png`
- `docs/implementation/validation/phase-4/home-mobile.png`
- `docs/implementation/validation/phase-4/insight-desktop-before.png`
- `docs/implementation/validation/phase-4/insight-desktop.png`
- `docs/implementation/validation/phase-4/insight-mobile.png`
- `docs/implementation/validation/phase-4/phase4-home-he-insight-capabilities-order.png`
- `docs/implementation/validation/phase-4/phase4-home-en-insight-capabilities-order.png`
- `docs/implementation/validation/phase-4/phase4-home-mobile-insight-capabilities-order.png`

### Files added by final Phase 4 acceptance verification

- `docs/implementation/validation/phase-4/concept-a-overlap-report.md`
- `docs/implementation/validation/phase-4/final-home-he-desktop.png`
- `docs/implementation/validation/phase-4/final-home-en-desktop.png`
- `docs/implementation/validation/phase-4/final-home-he-mobile.png`
- `docs/implementation/validation/phase-4/final-home-en-mobile.png`
- `docs/implementation/validation/phase-4/final-home-he-insight-capabilities.png`
- `docs/implementation/validation/phase-4/final-home-en-insight-capabilities.png`
- `docs/implementation/validation/phase-4/final-insight-he-desktop.png`
- `docs/implementation/validation/phase-4/final-insight-en-desktop.png`
- `docs/implementation/validation/phase-4/final-insight-he-mobile.png`
- `docs/implementation/validation/phase-4/final-insight-en-mobile.png`
- `docs/implementation/validation/phase-4/overlap-check-he-1440.png`
- `docs/implementation/validation/phase-4/overlap-check-en-1440.png`
- `docs/implementation/validation/phase-4/overlap-check-he-1024.png`
- `docs/implementation/validation/phase-4/overlap-check-en-1024.png`
- `docs/implementation/validation/phase-4/overlap-check-he-768.png`
- `docs/implementation/validation/phase-4/overlap-check-en-768.png`
- `docs/implementation/validation/phase-4/overlap-check-he-390.png`
- `docs/implementation/validation/phase-4/overlap-check-en-390.png`
- `docs/implementation/validation/phase-4/overlap-check-he-320.png`
- `docs/implementation/validation/phase-4/overlap-check-en-320.png`

### Existing files changed in Phase 4

- `content/site-structure.json`
- `docs/design-concepts/README.md`
- `docs/implementation/huma-website-master-plan.md`
- `index.html`
- `messages/en/navigation.json`
- `messages/he/navigation.json`
- `messages/en/assessment.json`
- `messages/he/assessment.json`
- `src/concepts/concept-a/components/ConceptASectionHeading.tsx`
- `src/concepts/concept-a/sections/HomeHeroSection.tsx`
- `src/concepts/concept-a/sections/ProblemInsightSection.tsx`
- `src/concepts/concept-a/sections/InsightOverviewSection.tsx`
- `src/concepts/concept-a/sections/CapabilitiesMethodSection.tsx`
- `src/concepts/concept-a/sections/ChallengesFormatsSection.tsx`
- `src/concepts/concept-a/sections/OutcomesContactSection.tsx`
- `src/components/SiteLayout.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/InsightPage.tsx`
- `src/shared/forms/DynamicForm.tsx`
- `src/styles.css`

### Implementation outcome

- The shared site layout now renders through the Concept A header and footer.
- The homepage now uses Concept A sections for hero, problem framing, insight entry, capabilities and method, challenges and formats, outcomes, and contact.
- The duplicate homepage `HUMA Organizational Insight` render was removed from the homepage composition and reduced to one authoritative retained section.
- `ProblemInsightSection` now serves only as organizational problem framing, while `InsightOverviewSection` remains the single homepage Insight entry with the six-question intro and localized CTA.
- The authoritative homepage order is now explicitly defined in `content/site-structure.json` with stable IDs:
  - `hero`
  - `organizational-context`
  - `organizational-insight`
  - `core-capabilities`
  - `huma-method`
  - `organizational-challenges`
  - `delivery-formats`
  - `organizational-outcomes`
  - `contact`
- Homepage sections now expose stable section IDs and labeled landmarks for `organizational-insight`, `core-capabilities`, `huma-method`, `organizational-challenges`, `delivery-formats`, `organizational-outcomes`, and `contact`.
- The Organizational Insight route now uses Concept A sections for the overview, active-question flow, and result/contact presentation.
- The dynamic form renderer was adapted to the Concept A form language without changing the shared form definitions.
- Navigation and assessment message files were extended only where the Concept A UI needed new accessible labels or flow controls.

### Commands executed for Phase 4

- `npm.cmd run build`
- `npm.cmd run validate:content`
- `npm.cmd run validate:language`
- local Vite dev server on `127.0.0.1:4173`
- local Microsoft Edge headless screenshots for Home desktop and mobile
- local Microsoft Edge CDP interaction verification for the Insight flow desktop and mobile

### Validation results

- Build result: passed.
- TypeScript result: passed through `tsc -b` inside `npm.cmd run build`.
- Content validation result: passed.
- Language validation result: passed.
- Browser plugin availability: not available in this session.
- Browser fallback used: local Microsoft Edge headless via CDP.
- Desktop and mobile screenshot evidence was saved under `docs/implementation/validation/phase-4/`.
- Targeted homepage hierarchy verification evidence was saved as:
  - `docs/implementation/validation/phase-4/phase4-home-he-insight-capabilities-order.png`
  - `docs/implementation/validation/phase-4/phase4-home-en-insight-capabilities-order.png`
  - `docs/implementation/validation/phase-4/phase4-home-mobile-insight-capabilities-order.png`
- Homepage Insight duplication verification passed:
  - Hebrew homepage exact `HUMA Organizational Insight` count: `1`
  - English homepage exact `HUMA Organizational Insight` count: `1`
  - Hebrew homepage Insight heading and landmark count: `1`
  - English homepage Insight heading and landmark count: `1`
  - no duplicate DOM IDs were detected
  - capabilities render before method on desktop and mobile
  - the retained CTA opens `/he/insight` and `/en/insight`
  - the `#contact` anchor remains reachable
- Insight interaction proof passed:
  - one answer became selected
  - progress changed from `שאלה 1 מתוך 6` to `שאלה 2 מתוך 6`
  - no relevant console warnings or console errors were recorded
  - no framework error overlay was detected

### Final acceptance verification addendum

- Final acceptance date: `2026-08-18`
- Final overlap report: `docs/implementation/validation/phase-4/concept-a-overlap-report.md`
- Final screenshot set:
  - `docs/implementation/validation/phase-4/final-home-he-desktop.png`
  - `docs/implementation/validation/phase-4/final-home-en-desktop.png`
  - `docs/implementation/validation/phase-4/final-home-he-mobile.png`
  - `docs/implementation/validation/phase-4/final-home-en-mobile.png`
  - `docs/implementation/validation/phase-4/final-home-he-insight-capabilities.png`
  - `docs/implementation/validation/phase-4/final-home-en-insight-capabilities.png`
  - `docs/implementation/validation/phase-4/final-insight-he-desktop.png`
  - `docs/implementation/validation/phase-4/final-insight-en-desktop.png`
  - `docs/implementation/validation/phase-4/final-insight-he-mobile.png`
  - `docs/implementation/validation/phase-4/final-insight-en-mobile.png`
- Final overlap screenshot set:
  - `docs/implementation/validation/phase-4/overlap-check-he-1440.png`
  - `docs/implementation/validation/phase-4/overlap-check-en-1440.png`
  - `docs/implementation/validation/phase-4/overlap-check-he-1024.png`
  - `docs/implementation/validation/phase-4/overlap-check-en-1024.png`
  - `docs/implementation/validation/phase-4/overlap-check-he-768.png`
  - `docs/implementation/validation/phase-4/overlap-check-en-768.png`
  - `docs/implementation/validation/phase-4/overlap-check-he-390.png`
  - `docs/implementation/validation/phase-4/overlap-check-en-390.png`
  - `docs/implementation/validation/phase-4/overlap-check-he-320.png`
  - `docs/implementation/validation/phase-4/overlap-check-en-320.png`
- Final overlap verification passed on `/he`, `/en`, `/he/insight`, and `/en/insight` from `320px` through `1440px`.
- Final zoom-equivalent verification passed at `1152px` and `960px`, representing `125%` and `150%` review tightening in headless QA.
- Localized route verification passed:
  - Hebrew homepage CTA opened `/he/insight`
  - English homepage CTA opened `/en/insight`
  - language switch from Hebrew Insight completed on `/en/insight` with final `lang="en"` and `dir="ltr"`
  - refresh preserved the localized Insight route
- Focus verification passed:
  - first tab stop reached the brand link in Hebrew and English
  - second tab stop reached the first primary navigation item in Hebrew and English
- Decorative safety verification passed:
  - no decorative-over-text overlaps remained
  - no horizontal overflow was detected
  - no failed application requests remained in the final QA summary
  - decorative thread layers remained unfocusable and kept `pointer-events: none`

### Known limitations retained after Phase 4

- Lint tooling is still unavailable in the current repository.
- Test tooling is still unavailable in the current repository.
- The mobile hero thread is simplified relative to the exact `concept-a-hero-mobile-v2.png` choreography.
- Direct browser zoom automation was approximated with equivalent-width checks in headless review.
- Final production review and concept sign-off remain a later user review decision.

### Phase 4 exit-criteria result

- Concept A is implemented in code on the shared application architecture.
- The targeted homepage hierarchy correction is implemented and verified.
- The blocking decorative-over-text collisions are corrected and verified.
- Shared content meaning and localized message architecture were preserved.
- Desktop and mobile validation evidence was saved.
- Final overlap evidence and reporting were saved.
- A separate Concept A design-system document was saved.
- A separate Concept A fidelity ledger was saved.
- A targeted Concept A Insight correction report and state evidence set were saved under `docs/implementation/validation/phase-4/`.
- No Phase 5 work was started.
- No deployment was performed.

Recommended Phase 4 status:

- `COMPLETED`

Approval state:

- `User approved` on `2026-08-18`

## 35. Phase 5 execution record

### Confirmed scope and guardrails for Phase 5

- User explicitly approved Phase 5 Concept C implementation on `2026-08-18`.
- Work remained limited to a separate Concept C presentation layer on top of the same shared content, messages, routes, dynamic forms, and assessment flow used by Concept A.
- Concept A remained the default experience; Concept C is reachable only through `?concept=c` for preview and review.
- No Phase 6 or later implementation work was started.
- No packages were installed.
- No Concept A PNG or Concept C PNG files were overwritten or regenerated.
- Git publication work was not started.
- Deployment was not performed.

### Files created in Phase 5

- `src/concepts/concept-c/ConceptCHomePage.tsx`
- `src/concepts/concept-c/components/ConceptCBrand.tsx`
- `src/concepts/concept-c/components/ConceptCHeader.tsx`
- `src/concepts/concept-c/components/ConceptCFooter.tsx`
- `src/concepts/concept-c/sections/ConceptCHomeHeroSection.tsx`
- `src/concepts/concept-c/sections/ConceptCProblemInsightSection.tsx`
- `src/concepts/concept-c/sections/ConceptCInsightOverviewSection.tsx`
- `src/concepts/concept-c/sections/ConceptCCapabilitiesMethodSection.tsx`
- `src/concepts/concept-c/sections/ConceptCChallengesFormatsSection.tsx`
- `src/concepts/concept-c/sections/ConceptCOutcomesContactSection.tsx`
- `src/concepts/concept-c/sections/ConceptCInsightQuestionFlowSection.tsx`
- `src/concepts/concept-c/sections/ConceptCInsightResultSection.tsx`
- `src/concepts/conceptMode.ts`
- `src/concepts/concept-c/components/ConceptCHeroArt.tsx`
- `src/concepts/concept-c/components/ConceptCCoiledThread.tsx`
- `docs/implementation/validation/phase-5/concept-c-fidelity-ledger.md`
- `docs/implementation/validation/phase-5/phase5-concept-c-check.cjs`
- `docs/implementation/validation/phase-5/phase5-concept-c-check.json`
- `docs/implementation/validation/phase-5/concept-c-home-he-desktop.png`
- `docs/implementation/validation/phase-5/concept-c-home-en-desktop.png`
- `docs/implementation/validation/phase-5/concept-c-home-he-mobile.png`
- `docs/implementation/validation/phase-5/concept-c-home-en-mobile.png`
- `docs/implementation/validation/phase-5/concept-c-insight-he-intro-desktop.png`
- `docs/implementation/validation/phase-5/concept-c-insight-en-intro-desktop.png`
- `docs/implementation/validation/phase-5/concept-c-insight-he-intro-mobile.png`
- `docs/implementation/validation/phase-5/concept-c-insight-en-intro-mobile.png`
- `docs/implementation/validation/phase-5/concept-c-insight-he-question-desktop.png`
- `docs/implementation/validation/phase-5/concept-c-insight-en-question-desktop.png`
- `docs/implementation/validation/phase-5/concept-c-insight-he-result-desktop.png`
- `docs/implementation/validation/phase-5/concept-c-insight-en-result-desktop.png`
- `docs/implementation/validation/phase-5/concept-c-insight-he-question-mobile.png`
- `docs/implementation/validation/phase-5/concept-c-insight-en-question-mobile.png`
- `docs/implementation/validation/phase-5/concept-c-insight-he-result-mobile.png`
- `docs/implementation/validation/phase-5/concept-c-insight-en-result-mobile.png`

### Existing files changed in Phase 5

- `src/pages/HomePage.tsx`
- `src/pages/InsightPage.tsx`
- `src/components/SiteLayout.tsx`
- `src/i18n/language.tsx`
- `src/app/AppRoutes.tsx`
- `src/styles.css`
- `src/shared/assessment/useInsightQuestionFlow.ts`
- `src/concepts/concept-c/sections/ConceptCHomeHeroSection.tsx`
- `src/concepts/concept-c/sections/ConceptCProblemInsightSection.tsx`
- `src/concepts/concept-c/sections/ConceptCCapabilitiesMethodSection.tsx`
- `docs/implementation/huma-website-master-plan.md`

### Implementation outcome

- A separate Concept C presentation tree was added under `src/concepts/concept-c/`, mirroring the Concept A section breakdown (hero, problem/insight, insight overview, capabilities and method, challenges and formats, outcomes/contact, insight question flow, insight result) without duplicating shared logic.
- Preview-only concept switching was added through `src/concepts/conceptMode.ts`, resolving the active concept from `?concept=a` / `?concept=c` with Concept A as the default when no query parameter is present, and retaining the concept parameter across localized route transitions.
- The Organizational Insight flow state was centralized in `src/shared/assessment/useInsightQuestionFlow.ts` so Concept A and Concept C render the same flow state instead of maintaining separate copies.
- Routing, language/RTL handling, dynamic forms, content schemas, and message catalogs remained fully shared between Concept A and Concept C; no concept-specific fork of shared logic was introduced.
- A `noindex,nofollow` robots meta is applied only when `concept=c` is active, keeping the preview path out of production indexing consideration ahead of the Phase 12 SEO phase.
- A small post-capture adjustment was applied to the Concept C hero thread labels so they derive from approved content rather than a weaker generic label; build and validation were re-run and passed after this adjustment.

### Fidelity correction (same day)

- After this record was first written, the user reviewed the implementation directly against the approved Concept C reference images and reported that the site did not resemble them.
- Direct pixel comparison against `docs/design-concepts/images/concept-c-hero-desktop.png`, `concept-c-problem-insight-desktop.png`, and `concept-c-capabilities-method-desktop.png` confirmed the gap: the Home hero had no isometric illustration, the Problem/Insight context area had no coiled-thread graphic and used a numbered list instead of the reference's divided captions, and the Capabilities/Method area was a plain text table instead of a connected flow diagram.
- Corrections implemented, all using real semantic HTML/SVG (no raster images, per §2 of this plan):
  - Added `ConceptCHeroArt.tsx`, a real SVG isometric-block illustration with a winding copper thread and accent cube, replacing the prior minimal thread-and-plinth composition in the Home hero.
  - Added `ConceptCCoiledThread.tsx`, a real SVG coiled-thread illustration for the Problem/Insight context area, and reflowed the change-item captions from a numbered vertical list into a divided horizontal column row; destyled the insight-entry block from a bordered card into a plain full-width block with a top divider.
  - Reworked the Capabilities/Method diagram in `ConceptCCapabilitiesMethodSection.tsx` and `styles.css` to add real spine-and-connector lines between the capabilities/outcomes items and the method column, and reflowed Discover/Design/Act into a horizontal row with node dots and direction-aware chevron connectors.
  - Caught and fixed a chevron-direction bug during verification: the initial CSS border-based chevron pointed the wrong way in Hebrew (down instead of left); replaced with an inline SVG mirrored via `scaleX(-1)` in RTL, then re-verified correct in both languages.
- Re-validation after the rework: `npm.cmd run build`, `npm.cmd run validate:content`, and `npm.cmd run validate:language` all passed.
- The full Phase 5 evidence set was regenerated against the corrected build using the existing `phase5-concept-c-check.cjs` script (against a local `vite preview` server), replacing the earlier evidence files under `docs/implementation/validation/phase-5/` with renders of the corrected implementation. No console warnings/errors, no duplicate DOM IDs, and no horizontal overflow were recorded.
- `docs/implementation/validation/phase-5/concept-c-fidelity-ledger.md` was revised in place to document the gap, the rework, and the updated known deviations (the illustrations are intentionally simplified relative to the fully rendered generated reference images; the connector diagram is a spine-and-tick approximation rather than exact per-item curves).

### Commands executed for Phase 5

- `npm.cmd run build`
- `npm.cmd run validate:content`
- `npm.cmd run validate:language`
- local Vite dev server (bound to `127.0.0.1:4174` because `4173` was already occupied during the capture pass)
- local Microsoft Edge headless screenshots and CDP interaction verification for Concept C Home, Insight intro, Insight question, and Insight result states in Hebrew and English, desktop and mobile

### Validation results

- Build result: passed.
- TypeScript result: passed through `tsc -b` inside `npm.cmd run build`.
- Content validation result: passed.
- Language validation result: passed.
- Browser plugin availability: not available in this session.
- Browser fallback used: local Microsoft Edge headless via CDP.
- Saved browser check evidence: `docs/implementation/validation/phase-5/phase5-concept-c-check.json`.
- Core browser checks from the saved evidence: page loaded with non-empty content on all captured states, no Vite error overlay, no duplicate DOM IDs, no horizontal overflow, no console warnings or errors, and localized Hebrew and English Insight intro/question/result states all captured successfully.

### Fidelity comparison

- A separate Concept C fidelity ledger was saved at `docs/implementation/validation/phase-5/concept-c-fidelity-ledger.md`, comparing the implementation section by section against the saved Concept C PNG references.
- The ledger documents that Concept C is structurally distinct from Concept A: a dedicated header/footer, an architectural plinth hero composition with a central thread spine instead of Concept A's editorial ledger and lateral thread, an integrated problem/insight transition section, a three-part capabilities/method/outcomes structural diagram, a list-and-statement Insight intro, a dedicated progress-rail Insight question layout, and a broad typographic Insight result layout with a different contact arrangement.
- The ledger records known deviations from the generated concept references: the Home hero uses simplified geometric plinth blocks rather than a fully image-like composition, some section labels remain more text-led than the illustrated reference images, and the full-page captures are taller and more document-like than the compressed reference montages.

### Known issues and deferred items retained after Phase 5

- Lint tooling is still unavailable in the current repository.
- Test tooling is still unavailable in the current repository.
- The earlier note about a blocked post-adjustment browser recapture no longer applies: the fidelity-correction rework above included a full successful recapture against the corrected build, so the saved Phase 5 screenshots now reflect the current code state.
- The hero illustration, coiled-thread graphic, and capabilities/method diagram are intentionally simplified relative to the fully rendered generated reference images (see the fidelity ledger's "Known deviations" for specifics); further illustrative refinement remains available if requested but is not required to close the fidelity gap the user identified.
- Concept switching (Phase 6), the dynamic assessment engine (Phase 7), and all later phases remain not started.
- Final production concept selection remains a Phase 14 decision.

### Phase 5 exit-criteria result

- Concept C is implemented in code on the shared application architecture, distinct from Concept A as required.
- Concept A remains the default experience; Concept C is reachable only through the `?concept=c` preview mechanism.
- Shared content meaning, messages, forms, and assessment logic were preserved and not duplicated per concept.
- Desktop and mobile validation evidence was saved for Hebrew and English, covering Home and the Insight intro/question/result states.
- A separate Concept C fidelity ledger was saved, including explicit evidence that Concept C is not Concept A with different colors.
- Build, content validation, and language validation all passed, including after the final hero-label adjustment.
- No Phase 6 or later work was started.
- No Git modification was performed.
- No deployment was performed.

Recommended Phase 5 status:

- `COMPLETED`

Approval state:

- `User approved` on `2026-08-19` (after the same-day fidelity correction documented above)

## 36. Phase 6 execution record

### Confirmed scope and guardrails for Phase 6

- User explicitly approved Phase 6 Concept Switching on `2026-08-19`, in the same conversation turn as approving Phase 5.
- Work remained limited to safe switching between the already-implemented Concept A and Concept C presentations: query-param switching (already present), `localStorage` persistence, a configurable and hideable internal review switcher, and preservation of in-progress Quiz state and canonical/noindex correctness across a switch.
- No Phase 7 or later implementation work was started.
- No packages were installed.
- Git publication work was not started. Deployment was not performed.

### Files created in Phase 6

- `src/shared/components/ConceptReviewSwitcher.tsx`
- `docs/implementation/validation/phase-6/phase6-switcher-check.cjs`
- `docs/implementation/validation/phase-6/phase6-switcher-check.json`
- `docs/implementation/validation/phase-6/switcher-he.png`
- `docs/implementation/validation/phase-6/switcher-hidden-by-default.png`
- `docs/implementation/validation/phase-6/phase6-concept-switching-report.md`

### Existing files changed in Phase 6

- `src/concepts/conceptMode.ts` renamed to `src/concepts/conceptMode.tsx`, converted from plain helper functions into a `ConceptProvider` React context exposing `useCurrentConcept()` (signature-compatible with all existing call sites) and a new `useConceptSwitcher()` hook.
- `src/app/AppProviders.tsx` (wired `ConceptProvider` inside `BrowserRouter`, wrapping `LanguageProvider`)
- `src/components/SiteLayout.tsx` (renders `ConceptReviewSwitcher` when `siteConfig.showConceptSwitcher` is true)
- `messages/he/system.json`, `messages/en/system.json` (added `conceptSwitcher.label` / `.optionA` / `.optionC`)
- `src/styles.css` (added `.concept-review-switcher` utility styles)
- `docs/implementation/huma-website-master-plan.md`

### Implementation outcome

- `localStorage` persistence of the reviewer's concept preference (key `huma-concept`) now mirrors the existing language-persistence pattern, with precedence: explicit `?concept=` query value, then stored preference, then `siteConfig.defaultConcept`.
- A hideable internal review switcher (`ConceptReviewSwitcher`) was added, gated by `siteConfig.showConceptSwitcher` (default `false`, matching the master-plan rule that the switcher is not part of the public HUMA marketing message). Verified visually with the flag temporarily enabled, then reverted to `false` before finalizing.
- Switching concept no longer risks losing in-progress Organizational Insight Quiz state: `ConceptProvider` updates the active concept without remounting the route tree, and `InsightPage.tsx` already centralizes Quiz flow state above the per-concept branch (from Phase 5), so `currentIndex`/answers survive a concept switch in either direction. Verified directly via browser automation.
- No duplicate-canonical regression: the existing `noindex,nofollow` logic in `SiteLayout.tsx` (`currentConcept !== siteConfig.defaultConcept`) required no change, since it was already concept-agnostic.
- Duplicate-analytics safety is not yet applicable and is explicitly deferred: Phase 11 (Marketing Analytics) has not started, so there is no analytics event layer yet to duplicate.
- A real pre-existing bug was found and fixed during this phase's own verification: `withRetainedConceptSearch` built a malformed URL (`/he#contact?concept=c`) for any concept-aware link whose target path already contained a hash fragment (for example the Contact CTA), because it appended the retained `?concept=` query after the hash instead of before it. Fixed by splitting the path at its first `#` and reinserting the query before the hash; verified the Contact link now resolves to `/he?concept=c#contact` while Concept C is active.

### Commands executed for Phase 6

- `npm.cmd run build`
- `npm.cmd run validate:content`
- `npm.cmd run validate:language`
- local `vite preview` server plus local Microsoft Edge headless via CDP (`docs/implementation/validation/phase-6/phase6-switcher-check.cjs`) driving: initial load, switcher clicks, a reload with no `?concept=` query, and a full Organizational Insight Quiz mid-flow concept switch in both directions

### Validation results

- Build result: passed.
- TypeScript result: passed through `tsc -b` inside `npm.cmd run build`.
- Content validation result: passed.
- Language validation result: passed (the two new `conceptSwitcher` message keys were added to both `messages/he/system.json` and `messages/en/system.json` with matching structure).
- Browser verification: all checks in `docs/implementation/validation/phase-6/phase6-switcher-check.json` passed — default concept resolution, switcher-driven query/storage updates, storage-based persistence across a reload with no query param, and Quiz-state preservation across a mid-flow concept switch in both directions.

### Known issues and deferred items retained after Phase 6

- Lint tooling is still unavailable in the current repository.
- Test tooling is still unavailable in the current repository.
- Duplicate-analytics safety for concept switching remains unverified until Phase 11 exists; this is a deferred check, not a skipped one.
- The dynamic assessment engine (Phase 7) and all later phases remain not started.

### Phase 6 exit-criteria result

- `?concept=a` / `?concept=c` switching works, unchanged from Phase 5.
- `localStorage` persistence of the concept preference works.
- The default concept remains configurable via `siteConfig.defaultConcept`.
- An internal concept-review switcher is implemented and hideable via `siteConfig.showConceptSwitcher` (default hidden).
- Switching concept preserves in-progress Quiz state in both directions, verified directly.
- No duplicate canonical URLs are introduced by concept switching.
- A real URL-construction bug affecting hash-based concept-aware links was found and fixed as part of this phase's own verification.
- No Phase 7 or later work was started.
- No Git modification was performed.
- No deployment was performed.

Recommended Phase 6 status:

- `COMPLETED`

Approval state:

- `User approved` on `2026-08-19`

## 37. Phase 7 execution record

### Confirmed scope and guardrails for Phase 7

- User explicitly approved Phase 7 Dynamic Assessment Engine on `2026-08-19`, in the same conversation turn as approving Phase 6.
- Before implementation, the user was asked how to apply branching/conditional-visibility to the six approved questions. Decision: build a fully generic engine, but keep the real content's default behavior unchanged (linear 1→2→3→4→5→6, all six questions always visible); prove branching/conditional visibility with a synthetic fixture rather than by altering which approved questions a real user sees.
- No external LLM call was added, per the explicit Phase 7 exclusion.
- No Phase 8 or later implementation work was started.
- No packages were installed. Git publication work was not started. Deployment was not performed.

### Files created in Phase 7

- `src/shared/assessment/insightEngine.ts`
- `scripts/validate-phase7.mjs`
- `docs/implementation/validation/phase-7/phase7-quiz-check.cjs`
- `docs/implementation/validation/phase-7/phase7-quiz-check.json`
- `docs/implementation/validation/phase-7/phase7-validation-report.json`
- `docs/implementation/validation/phase-7/phase7-result-with-restart-he.png`
- `docs/implementation/validation/phase-7/phase7-intro-mobile-he.png`
- `docs/implementation/validation/phase-7/phase7-dynamic-assessment-report.md`

### Existing files changed in Phase 7

- `src/shared/assessment/assessmentCatalog.ts`
- `src/shared/assessment/useInsightQuestionFlow.ts`
- `src/pages/InsightPage.tsx`
- `src/concepts/concept-a/sections/InsightResultSection.tsx`
- `src/concepts/concept-c/sections/ConceptCInsightResultSection.tsx`
- `content/assessment.json`
- `messages/he/insight-result.json`, `messages/en/insight-result.json`
- `src/styles.css`
- `package.json`
- `docs/implementation/huma-website-master-plan.md`

### Implementation outcome

- A pure, framework-free engine module (`insightEngine.ts`) now owns conditional visibility (`visibleWhen`), branching (`nextQuestionId`, now resolvable per-option), per-question-type validation (replacing a generic non-empty check with real minLength/maxLength/minSelections/maxSelections rules), completion-payload construction, and mock-result computation from `capabilityMapping`.
- `content/assessment.json` gained real `capabilityMapping` data on the `challenge`, `impact`, and `desired-change` questions only, mapping existing approved options to the four already-approved capability ids (presence, resilience, adaptability, leadership). `audience` and `current-state` were deliberately left unmapped rather than inventing an artificial capability signal for them.
- A real pre-existing bug was found and fixed during this phase's own verification: `InsightPage` previously reset the entire Quiz (state and answers) on every `location.pathname` change, which fires on a language switch (`/he/insight` ↔ `/en/insight`), silently breaking the "answer preservation across language switching" requirement. The effect was removed; state now restores from versioned `localStorage` persistence via lazy initializers on mount, which also makes a full page reload and home↔insight navigation resume correctly.
- Back navigation (`moveBack`) now pops a `visitedQuestionIds` history stack instead of doing raw index arithmetic, so it stays correct even when branching skips a question.
- A minimal "retake the assessment" restart control was added to both concepts' Result sections, the only visible UI change in this phase; the result card's content itself remains static, since dynamic result rendering is explicitly Phase 9's responsibility.
- A debug-only `window.__HUMA_DEBUG_LAST_INSIGHT_RESULT__` global is set on completion (client-side only, never transmitted) purely so the completion payload and mock result could be inspected during browser verification.

### Commands executed for Phase 7

- `npm.cmd run build`
- `npm.cmd run validate:content`
- `npm.cmd run validate:language`
- `npm.cmd run validate:quiz` (new)
- local `vite preview` server plus local Microsoft Edge headless via CDP (`docs/implementation/validation/phase-7/phase7-quiz-check.cjs` and an additional Concept C spot-check) driving full Quiz completions, a restart, a mid-flow full page reload, and a mid-flow language switch

### Validation results

- Build result: passed. TypeScript result: passed through `tsc -b` inside `npm.cmd run build`.
- Content validation result: passed. Language validation result: passed.
- New quiz-engine validation result: passed — structural schema checks, a full walkthrough of the real six-question content (confirming the unchanged linear order and a valid computed mock result), per-type validation self-tests, and a synthetic branching/conditional-visibility self-test all passed. Full report: `docs/implementation/validation/phase-7/phase7-validation-report.json`.
- Browser verification: full Quiz completion in Concept A (Hebrew) and Concept C (English) both reached the result state with a correct completion payload and mock result; restart correctly cleared state; persistence survived a full page reload mid-flow; a language switch mid-flow preserved progress (confirming the fix above). No console warnings or errors were recorded in any scenario. Full report: `docs/implementation/validation/phase-7/phase7-quiz-check.json`.

### Known issues and deferred items retained after Phase 7

- Lint tooling is still unavailable in the current repository.
- Test tooling is still unavailable in the current repository; `scripts/validate-phase7.mjs` follows this repo's existing convention of a plain-JS Node validation script rather than a test runner.
- Branching and conditional visibility are proven generically but not exercised on the live six approved questions, per the explicit user decision.
- Dynamic result rendering, secure LLM integration, and all later phases remain not started.

### Phase 7 exit-criteria result

- External Quiz definition, schema-driven rendering, and a dynamic (not hardcoded) question count are all in place.
- Conditional visibility and branching are implemented and proven.
- Real per-question-type validation replaces the previous generic check.
- Safe local persistence works across reload, home↔insight navigation, and language switching.
- A structured completion payload and a locally-computed mock result (no LLM call) are produced on completion.
- Hebrew, English, Concept A, and Concept C were all verified.
- No external LLM call was added.
- No Phase 8 or later work was started.
- No Git modification was performed. No deployment was performed.

Recommended Phase 7 status:

- `COMPLETED`

Approval state:

- `User approved` on `2026-08-19`

## 38. Phase 8 execution record

### Confirmed scope and guardrails for Phase 8

- User explicitly approved Phase 8 Secure LLM Integration on `2026-08-19`, in the same conversation turn as approving Phase 7.
- Before implementation, the user was asked how to reconcile Phase 8's deliverable list (which includes real OpenAI and Claude providers) with this plan's own "Do not call OpenAI or Claude" guardrail and "real LLM credentials remain prohibited until explicitly approved" rule. Decision: build the full provider architecture, including real, correctly-implemented OpenAI and Claude provider code, but never call either service with real credentials in this phase. Installing the `openai` and `@anthropic-ai/sdk` packages was explicitly approved as part of this decision.
- `LLM_PROVIDER=mock` remains the default; no real API keys were ever created or configured anywhere in the repository or environment.
- No Phase 9 or later implementation work was started. Git publication work was not started. Deployment was not performed.

### Files created in Phase 8

- `.gitignore` (the repository had none before this phase; now excludes `.env*`, `node_modules/`, `dist/`, and build artifacts)
- `.env.example`
- `server/api/analyze-assessment.mjs`
- `server/devServer.mjs`
- `server/providers/llm-provider.mjs`, `mock-provider.mjs`, `openai-provider.mjs`, `claude-provider.mjs`
- `server/prompts/he/organizational-insight.md`, `server/prompts/en/organizational-insight.md`
- `server/schemas/assessment-request.schema.mjs`, `insight-result.schema.mjs`
- `server/services/assessment-normalizer.mjs`, `prompt-loader.mjs`, `prompt-composer.mjs`, `result-validator.mjs`, `rate-limiter.mjs`, `prompt-injection-guard.mjs`
- `api/organizational-insight/analyze.mjs` (Vercel Node function adapter; inert until Phase 16 deployment)
- `scripts/validate-phase8.mjs`
- `docs/implementation/validation/phase-8/phase8-endpoint-check.mjs`
- `docs/implementation/validation/phase-8/phase8-endpoint-check.json`
- `docs/implementation/validation/phase-8/phase8-validation-report.json`
- `docs/implementation/validation/phase-8/phase8-secure-llm-report.md`

### Existing files changed in Phase 8

- `package.json` (added `openai` and `@anthropic-ai/sdk` dependencies; added `server:dev` and `validate:llm` scripts)
- `docs/implementation/huma-website-master-plan.md`

### Implementation outcome

- Built the full `server/` architecture from the master plan's §13 layout, adapted to plain `.mjs` files (matching this repo's existing plain-Node-script convention used by `scripts/validate-phase*.mjs`) rather than adding a TypeScript execution step for server code.
- `server/api/analyze-assessment.mjs` holds one framework-agnostic handler (`handleAnalyzeAssessment`) that both the Vercel adapter (`api/organizational-insight/analyze.mjs`, inert until deployment) and the local dev server (`server/devServer.mjs`) call — the same code path was exercised in verification as would run in production.
- Provider abstraction: one shared `LlmProvider` interface and `ProviderError` (`PROVIDER_UNAVAILABLE` | `TIMEOUT` | `INVALID_PROVIDER_OUTPUT`) that mock, OpenAI, and Claude providers all implement identically; the endpoint never depends on a specific provider.
- OpenAI provider uses Structured Outputs (`response_format: json_schema`, `strict: true`); Claude provider forces structured output via a single tool call (`tool_choice`). Both read their API key from environment variables and throw `PROVIDER_UNAVAILABLE` immediately — before constructing any request — when the key is absent.
- External, versioned Hebrew and English prompts were written using approved HUMA terminology (Presence/Resilience/Adaptability/Leadership, Discover/Design/Act), with explicit analysis rules and explicit prompt-injection safety instructions baked into the prompt text itself.
- Request validation is strict against the real `content/assessment.json`: rejects unknown fields, unknown question/option ids, wrong answer shape, over-length open text (2000 chars), oversized request bodies (20KB), and quiz-version mismatches (classified separately as `UNSUPPORTED_QUIZ_VERSION`).
- The structured result schema (matching §15's field list) is defined once and used as both the JSON Schema handed to providers and the runtime validator applied to whatever they return — the frontend never learns which provider produced a result, and raw LLM output is never returned to the client.
- Prompt-injection protection is implemented as a documented best-effort mitigation (pattern-based neutralization of common injection phrasing in both languages) rather than a false guarantee of immunity.
- Rate limiting (10 requests/minute per client key, in-memory) is documented as an honest match for the project's current non-deployed, single-process state, with production-grade distributed limiting explicitly deferred to whenever real hosting is chosen.
- Server logs are redacted by construction: only `{quizId, quizVersion, language, answerCount}` is ever logged, never free-text answers, provider raw errors, or API keys.

### Verification without network calls

- With no API key configured, both `openaiProvider.analyze()` and `claudeProvider.analyze()` were confirmed to throw `PROVIDER_UNAVAILABLE` synchronously, before any request is constructed — confirmed both directly and at the HTTP layer (`LLM_PROVIDER=openai` / `=claude` with no key → `503 PROVIDER_UNAVAILABLE`).
- The pure response-parsing functions from each real provider (`parseChatCompletionContent`, `parseToolUseInput`) were extracted and tested directly against realistic fake response objects (well-formed and malformed), proving the parsing/error-classification logic without any network dependency.
- Neither OpenAI nor Claude was ever actually called over the network at any point during this phase's implementation or verification.

### Commands executed for Phase 8

- `npm.cmd install openai @anthropic-ai/sdk`
- `npm.cmd run build`
- `npm.cmd run validate:content`
- `npm.cmd run validate:language`
- `npm.cmd run validate:quiz`
- `npm.cmd run validate:llm` (new)
- local dev server (`node server/devServer.mjs`) exercised over real HTTP with `curl` and a dedicated Node script for the valid-request, invalid-request, and rate-limiting scenarios, run separately under `LLM_PROVIDER=mock`, `=openai`, and `=claude` (the latter two with no API key configured)

### Validation results

- Build result: passed — server/API code lives outside `src/` and is untouched by the Vite build.
- Content validation, language validation, and quiz-engine validation: all still passed, confirming no regression to earlier phases.
- New LLM validation result: passed — 25 checks covering request schema, result schema, prompt loading/composition, the prompt-injection guard, the mock provider, both real providers' response parsing and fail-safe behavior, the rate limiter, and an in-process end-to-end run through the mock provider. Full report: `docs/implementation/validation/phase-8/phase8-validation-report.json`.
- HTTP-level endpoint verification: a valid request returns `200` with a full structured result; an unsupported quiz version returns `409`; an unexpected field and an over-length answer both return `400`; 12 rapid requests correctly split into 6×`200` then 6×`429` at the 10/minute limit. Full report: `docs/implementation/validation/phase-8/phase8-endpoint-check.json`.

### Known issues and deferred items retained after Phase 8

- Lint and test-runner tooling are still unavailable in the current repository; `scripts/validate-phase8.mjs` follows the existing plain-Node-script convention and, unlike Phase 7's validator, imports the real server modules directly rather than duplicating their logic.
- Final LLM provider and model selection remain an open decision (§23), unchanged by this phase — `mock` remains the default.
- Rate limiting, cost configuration, and usage monitoring remain deferred to whenever real hosting and a real provider connection are approved.
- Dynamic result rendering (Phase 9) and secure email delivery (Phase 10) remain not started.

### Phase 8 exit-criteria result

- Secure server endpoint, provider abstraction, mock provider, OpenAI provider, and Claude provider are all implemented and verified.
- External Hebrew and English prompts, prompt loader, and prompt composer are implemented.
- Request validation and a provider-independent structured result schema with result validation are implemented.
- Failure handling covers every required state with a distinct, classified error code.
- Rate limiting and prompt-injection protection are implemented.
- The browser never calls OpenAI or Claude directly, never receives API keys, and never receives raw provider errors or stack traces.
- Neither OpenAI nor Claude was ever actually called over the network in this phase.
- No Phase 9 or later work was started. No Git modification was performed. No deployment was performed.

Recommended Phase 8 status:

- `COMPLETED`

Approval state:

- `User approved` on `2026-08-19`

## 39. Phase 9 execution record

### Confirmed scope and guardrails for Phase 9

- User explicitly approved Phase 9 Dynamic Result Experience on `2026-08-19`, in the same conversation turn as approving Phase 8.
- Before implementation, the user was asked how to reconcile the new structured result's unmapped fields (`executiveSummary`, `organizationalAnalysis`, `possibleOrganizationalImpact`, `suggestedNextStep`, `disclaimer`) with the approved Concept A/C result screens, which have no slot for them. Decision: minimal integration — map only onto existing approved UI slots; do not add new UI sections for the unmapped fields.
- No Phase 10 or later implementation work was started. Git publication work was not started. Deployment was not performed.

### Files created in Phase 9

- `src/shared/assessment/insightResultTypes.ts`
- `src/shared/assessment/insightApiClient.ts`
- `src/concepts/concept-a/sections/AnalyzingStateSection.tsx`
- `src/concepts/concept-c/sections/ConceptCAnalyzingStateSection.tsx`
- `docs/implementation/validation/phase-9/phase9-dynamic-result-check.cjs` / `.json`
- `docs/implementation/validation/phase-9/phase9-failure-path-check.cjs` / `.json`
- `docs/implementation/validation/phase-9/phase9-screenshots.cjs`
- `docs/implementation/validation/phase-9/phase9-result-dynamic-he-desktop-fixed.png`
- `docs/implementation/validation/phase-9/phase9-result-dynamic-c-en-mobile.png`
- `docs/implementation/validation/phase-9/phase9-focus-list-bug-before-fix.png`, `phase9-focus-list-bug-before-fix-fullpage.png`
- `docs/implementation/validation/phase-9/phase9-dynamic-result-report.md`

### Existing files changed in Phase 9

- `vite.config.ts`
- `src/pages/InsightPage.tsx`
- `src/shared/assessment/useInsightQuestionFlow.ts`
- `src/concepts/concept-a/sections/InsightResultSection.tsx`
- `src/concepts/concept-c/sections/ConceptCInsightResultSection.tsx`
- `src/styles.css`
- `messages/he/insight-result.json`, `messages/en/insight-result.json`
- `docs/implementation/huma-website-master-plan.md`

### Implementation outcome

- `InsightPage` now calls the Phase 8 endpoint on Quiz completion via `requestInsightAnalysis`, instead of only building a client-side mock result. A Vite dev/preview proxy (`/api` → `http://127.0.0.1:8787`) was added so this works locally without any deployment.
- A new `"analyzing"` page state covers both loading and error sub-states, with minimal per-concept components (`AnalyzingStateSection`, `ConceptCAnalyzingStateSection`) reusing each concept's existing typography/button classes.
- On failure, the user can retry (re-sends the same payload) or accept a safe fallback, which shows the original pre-Phase-9 static approved result content — not new, invented copy.
- Fixed a real gap: completed Quiz answers were previously cleared from persistence as soon as the Quiz finished, before the analysis request even ran. Persistence now only clears once a result (real or accepted fallback) is actually shown, so a failed analysis no longer loses the user's completed answers — confirmed directly with the API server stopped mid-test.
- Found and fixed a genuine bug during this phase's own verification: after a successful analysis, the persistence-writing effect in `useInsightQuestionFlow` was re-firing on every subsequent render (because its `currentQuestion` dependency is a new object reference each render) and silently re-writing the stale completed answers back into `localStorage` after they had just been cleared. Fixed by calling the hook's existing `resetFlow()` once a result is shown, which resets the hook's in-memory state too so the effect writes the correct empty state instead.
- Found and fixed a **pre-existing Phase 4 bug**, not introduced by this phase: Concept A's "what to examine" focus-items list rendered with completely invisible text, despite the DOM/computed styles reporting the elements as positioned, colored, and visible. The identical symptom is present in the already-approved `docs/implementation/validation/phase-4/final-insight-he-desktop.png`, confirming it predates Phase 9. Root cause: `.concept-result__block ul` relied on the default `list-style: disc` marker while being `display: grid`, a combination that reliably failed to paint in this environment (Concept C was unaffected — it already used `list-style: none`). Fixed with an explicit CSS-drawn dot marker matching the site's existing accent visual language. Verified with a corrected before/after screenshot comparison (an initial diagnostic pass without an explicit viewport override gave a misleading result, caught and corrected before drawing conclusions).

### Commands executed for Phase 9

- `npm.cmd run build`
- `npm.cmd run validate:content`
- `npm.cmd run validate:language`
- `npm.cmd run validate:quiz`
- `npm.cmd run validate:llm`
- local API dev server (`node server/devServer.mjs`) plus `vite preview` with the new proxy, driven over real HTTP/browser via dedicated Node/CDP scripts for the success path, the failure/retry/fallback path (API server deliberately stopped), and screenshot capture in both concepts, both languages, desktop and mobile

### Validation results

- Build, content validation, language validation, quiz-engine validation, and LLM validation: all still passed, confirming no regression to earlier phases.
- Success-path browser verification: both concepts reach the result state with the real dynamic capability, focus items, and Discover/Design/Act direction text rendered correctly; no console warnings or errors; `localStorage` correctly reset after success (not resurrected). Full report: `docs/implementation/validation/phase-9/phase9-dynamic-result-check.json`.
- Failure-path browser verification (API server stopped): analysis fails and shows the error state while leaving all six completed answers intact in `localStorage`; retry fails again with answers still intact; accepting the fallback shows the original approved static content and resets storage. Full report: `docs/implementation/validation/phase-9/phase9-failure-path-check.json`.
- Visual verification: before/after screenshots confirm the Concept A focus-list fix; a Concept C mobile screenshot confirms the dynamic result renders correctly there without any fix needed.

### Known issues and deferred items retained after Phase 9

- `executiveSummary`, `organizationalAnalysis`, `possibleOrganizationalImpact`, `suggestedNextStep`, and `disclaimer` are computed by the endpoint but not visually rendered anywhere, per the user's explicit minimal-mapping decision.
- The Concept A focus-list fix touches already-approved Phase 4 markup/CSS; flagged explicitly rather than folded in silently. No broader Concept A visual QA sweep was performed — that remains Phase 13's job.
- Secure email delivery for the existing contact form remains Phase 10's job, unchanged by this phase.
- Lint and test-runner tooling remain unavailable in the current repository.

### Phase 9 exit-criteria result

- Loading state, structured success result, retry state, provider-failure state, and safe fallback are all implemented and verified.
- Hebrew and English, Concept A and Concept C, are all verified.
- Safe email continuation: the existing local-only contact form remains reachable and functional in every state.
- No Phase 10 or later work was started. No Git modification was performed. No deployment was performed.

Recommended Phase 9 status:

- `COMPLETED`

Approval state:

- `User approved` on `2026-08-19`

## 40. Phase 10 execution record

### Confirmed scope and guardrails for Phase 10

- User explicitly approved Phase 10 Secure Email Integration on `2026-08-19`, in the same conversation turn as approving Phase 9.
- Before implementation, the user was asked (mirroring the Phase 8 pattern) which real email provider to build. Decision: a generic SMTP provider only (via `nodemailer`), no vendor-specific API — matching this plan's "Do not send email" guardrail and mock-first order.
- The user was also asked what the insight-delivery email should contain, since this is an explicit open decision in §23. Decision: only the structured `primaryCapability`/`secondaryCapabilities` fields, never raw LLM narrative text.
- No real email was ever sent in this phase. No Phase 11 or later implementation work was started. Git publication work was not started. Deployment was not performed.

### Files created in Phase 10

- `server/api/contact.mjs`, `server/api/deliver-insight.mjs`
- `server/email/email-provider.mjs`, `server/email/email-service.mjs`
- `server/email/providers/mock-email-provider.mjs`, `server/email/providers/smtp-email-provider.mjs`
- `server/schemas/contact-request.schema.mjs`, `server/schemas/insight-delivery-request.schema.mjs`
- `server/templates/he/contact-notification.md`, `contact-confirmation.md`, `insight-delivery.md`
- `server/templates/en/contact-notification.md`, `contact-confirmation.md`, `insight-delivery.md`
- `api/contact.mjs`, `api/insight/deliver.mjs`
- `src/shared/forms/formApiClient.ts`
- `scripts/validate-phase10.mjs`
- `docs/implementation/validation/phase-10/phase10-form-check.cjs` / `.json`
- `docs/implementation/validation/phase-10/phase10-validation-report.json`
- `docs/implementation/validation/phase-10/phase10-contact-form-success-he.png`
- `docs/implementation/validation/phase-10/phase10-secure-email-report.md`

### Existing files changed in Phase 10

- `server/devServer.mjs`
- `src/shared/forms/DynamicForm.tsx`
- `src/components/ContactForm.tsx`
- `src/concepts/concept-a/sections/InsightResultSection.tsx`, `src/concepts/concept-c/sections/ConceptCInsightResultSection.tsx`
- `src/pages/InsightPage.tsx`
- `src/styles.css`
- `forms/contact-form.json`, `forms/insight-email-form.json`
- `messages/he/system.json`, `messages/en/system.json`
- `messages/he/contact-form.json`, `messages/en/contact-form.json`
- `.env.example`
- `package.json`
- `docs/implementation/huma-website-master-plan.md`

### Implementation outcome

- Built `POST /api/contact` and `POST /api/insight/deliver`, matching the master plan's planned routes exactly, following the same framework-agnostic core-handler pattern established in Phase 8 (one handler function called identically by the local dev server and the inert-until-deployment Vercel adapters).
- Provider abstraction: shared `EmailError` interface, `mockEmailProvider` (default, no network) and `smtpEmailProvider` (real, via `nodemailer`, fails safe with `PROVIDER_UNAVAILABLE` before any connection attempt if `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASSWORD`/`SMTP_FROM_ADDRESS` are not all configured).
- External, versioned templates for both languages: contact notification (to HUMA's internal recipient), contact confirmation (built for structural completeness, not currently sent — the "send a user confirmation" question remains open per §23), and insight delivery (to the submitter, capability summary only).
- The client can never direct delivery to an arbitrary address: `/api/insight/deliver` always sends to the request's own validated `fields.email` (no separate recipient parameter exists in the schema); `/api/contact`'s recipient is always the server-side `CONTACT_NOTIFICATION_EMAIL` configuration, never supplied by the client.
- Added a shared, visually-hidden honeypot field (`website`) to every `DynamicForm`-rendered form; a filled honeypot returns an ordinary-looking success without sending anything or revealing detection.
- Added header-injection protection: any value placed into an email header (`to`/`replyTo`/`subject`) has CRLF sequences stripped before being handed to a provider.
- Replaced `DynamicForm`'s previous fully-client-side fake submission with a real call to the new endpoints, with honest `submitting`/`success`/`validationError`/`sendError` states and updated copy (the old "this form stays local"/"prepares a future form" placeholder text is gone).
- `InsightPage` now derives `insightContext` from the real dynamic result (or, on the fallback path, the fixed capability the existing static approved content already represents) and threads it through to the embedded contact form on the result screen.

### A gap found and fixed during this phase's own verification

While writing the "the client cannot add a recipient-override field" test case, discovered that the request schemas validated `fields` strictly but not top-level request keys — an extra field at the top level (not inside `fields`) would have been silently ignored rather than rejected. Not a real vulnerability (the extra field was never read anywhere), but inconsistent with the stricter Phase 8 pattern. Fixed by adding the same top-level-key allowlist check `assessment-request.schema.mjs` already used, to both new schemas.

### Commands executed for Phase 10

- `npm.cmd install nodemailer`
- `npm.cmd run build`
- `npm.cmd run validate:content`
- `npm.cmd run validate:language`
- `npm.cmd run validate:quiz`
- `npm.cmd run validate:llm`
- `npm.cmd run validate:email` (new)
- local API dev server (`node server/devServer.mjs`, extended to all three routes) plus `vite preview`, driven over real HTTP/browser via a dedicated Node/CDP script for the contact form (both with and without `CONTACT_NOTIFICATION_EMAIL` configured, to confirm the fail-safe behavior) and the full Quiz-completion → insight-delivery-form path

### Validation results

- Build, content validation, language validation, quiz-engine validation, and LLM validation: all still passed, confirming no regression to earlier phases.
- New email validation result: passed — 22 checks covering both request schemas (including honeypot detection and the top-level-key gap found and fixed above), all 6 template/language combinations rendering and sending via the mock provider, the mock provider's no-network send, the SMTP provider's fail-safe behavior with no credentials, and two in-process end-to-end handler runs. Full report: `docs/implementation/validation/phase-10/phase10-validation-report.json`.
- Browser verification: the contact form correctly refused to send with no `CONTACT_NOTIFICATION_EMAIL` configured, then succeeded once it was set; the insight-delivery form succeeded after a full Quiz completion; the honeypot field was confirmed hidden from both sighted users and assistive technology. No console warnings or errors. Full report: `docs/implementation/validation/phase-10/phase10-form-check.json`.

### Known issues and deferred items retained after Phase 10

- The contact-confirmation template exists but is not sent — remains an open product decision (§23).
- Real SMTP credentials were never configured or used; the final email provider choice remains open.
- This historical open decision was resolved on `2026-08-22` when the user selected Brevo. The later Brevo integration uses its server-side Transactional Email API and does not alter the completed historical Phase 10 record.
- Rate limiting remains in-memory/per-process, the same documented limitation as Phase 8.
- Lint and test-runner tooling remain unavailable in the current repository.
- Marketing analytics, campaign attribution, cookie consent (Phase 11) and SEO/search visibility (Phase 12) remain not started.

### Phase 10 exit-criteria result

- Secure server-side endpoints for both contact and insight delivery are implemented and verified.
- Provider abstraction (mock + real generic SMTP) is implemented; mock exercised end-to-end, SMTP verified to fail safe with no credentials.
- External, versioned Hebrew and English templates are implemented and verified.
- Request validation against the real form definitions is implemented and verified.
- The client cannot submit an arbitrary recipient address for either endpoint.
- The browser never sends email directly, never receives SMTP credentials, and never receives raw provider errors.
- No Phase 11 or later work was started. No Git modification was performed. No deployment was performed.

Recommended Phase 10 status:

- `READY FOR REVIEW`

Approval state:

- `Pending user review`


## 41. Phase 11 execution record

### Confirmed scope and guardrails for Phase 11

- User explicitly approved Phase 11 Marketing Analytics, Campaign Attribution and Cookie Consent on `2026-08-19`, in the same conversation turn as approving Phase 10 as complete.
- Before implementation, the user was asked (mirroring the Phase 8/Phase 10 pattern) how far to build the marketing-analytics provider layer. Decision: full architecture — a mock provider (default, always active) plus real Google (gtag/GTM), Meta Pixel, and TikTok Pixel provider implementations — but no tracking script is ever loaded and no real tracking call is ever made, matching this plan's "Do not add tracking scripts" guardrail.
- No real tracking script was ever loaded and no real tracking network request was ever sent in this phase. No Phase 12 or later implementation work was started. Git publication work was not started. Deployment was not performed.

### Files created in Phase 11

- `config/analytics.json`, `config/marketing-events.json`
- `src/analytics/event-catalog.ts`, `analytics-provider.ts`, `analytics-service.ts`, `attribution-service.ts`, `consent-service.ts`, `tag-loader.ts`, `AnalyticsContext.tsx`
- `src/analytics/providers/mock-analytics-provider.ts`, `google-provider.ts`, `meta-provider.ts`, `tiktok-provider.ts`
- `src/shared/components/CookieConsentBanner.tsx`
- `scripts/validate-phase11.mjs`
- `docs/implementation/validation/phase-11/phase11-analytics-check.cjs` / `.json`
- `docs/implementation/validation/phase-11/phase11-validation-report.json`
- `docs/implementation/validation/phase-11/phase11-consent-banner-summary-he.png`, `phase11-consent-banner-preferences-he.png`
- `docs/implementation/validation/phase-11/phase11-marketing-analytics-report.md`

### Existing files changed in Phase 11

- `src/app/AppProviders.tsx`
- `src/main.tsx`
- `src/components/SiteLayout.tsx`
- `src/concepts/concept-a/sections/HomeHeroSection.tsx`, `src/concepts/concept-c/sections/ConceptCHomeHeroSection.tsx`
- `src/pages/HomePage.tsx`, `src/concepts/concept-c/ConceptCHomePage.tsx`
- `src/pages/InsightPage.tsx`
- `src/shared/forms/DynamicForm.tsx`
- `src/styles.css`
- `messages/he/cookie-consent.json`, `messages/en/cookie-consent.json`
- `package.json`
- `docs/implementation/huma-website-master-plan.md`

### Implementation outcome

- Built a 21-event catalog (`config/marketing-events.json`) matching the master plan's §19 list exactly, each event tagged with the consent categories it is eligible to be sent under, and a `assertSafeEventPayload()` guard (`src/analytics/event-catalog.ts`) that rejects any payload containing a hard-coded prohibited key (PII, Quiz answers, LLM prompt/result content, credentials, stack traces) before it can reach any provider.
- Provider abstraction: shared `AnalyticsProvider` interface, `mockAnalyticsProvider` (default, console-only) and real `googleProvider`/`metaProvider`/`tiktokProvider` implementations whose `init()` is a no-op unless explicitly enabled **and** a real id is configured — neither true by default, so no tracking script is ever injected and no `gtag`/`fbq`/`ttq` call is ever made.
- Single tracking chokepoint: `analyticsService.track()` is the only place any provider is called from; it validates payload safety and dispatches only to providers that are both eligible for the event and currently consented. Business components never call a vendor SDK directly.
- Consent state: 4 categories (`essential` always granted; `functional`/`analytics`/`marketing` opt-in, default `false`), versioned and persisted to `localStorage`, wired through `AnalyticsContextProvider` in `AppProviders.tsx`, driving provider initialization via `applyConsent()`.
- Cookie consent banner (summary + preferences views, both languages) rendered in `SiteLayout.tsx`, backed by newly populated `messages/{he,en}/cookie-consent.json` content; self-hides once consent is resolved.
- Campaign attribution: first-touch UTM capture in `main.tsx`, running synchronously before React Router, so parameters survive client-side redirects; persisted to `localStorage`; verified structurally separate from Quiz/LLM code via a grep-based check that `prompt-composer.mjs`/`assessment-normalizer.mjs` never reference `attribution-service`.
- Event instrumentation wired through `page_view`/`language_changed` (`SiteLayout.tsx`), CTA clicks (home hero, both concepts), the full Quiz-to-insight-result lifecycle (`InsightPage.tsx`), and form lifecycle events (`DynamicForm.tsx`), plus the consent events fired by the banner itself.

### Bugs found and fixed during this phase's own verification

1. A TypeScript build error in `meta-provider.ts` (`'fbq' is possibly 'undefined'`, implicit-`any[]`), caused by a self-referencing function typed off the optional `Window["fbq"]` property. Fixed with a standalone `FbqFunction` type.
2. An event-ordering bug: `quiz_step_completed` for the final Quiz question fired after `quiz_completed`/`insight_analysis_started` instead of before, because the original tracking call ran after `handleContinue()` returned, and for the final question that call synchronously triggers the entire completion cascade before returning. Fixed by moving the tracking call to before `handleContinue()` is invoked, gated on the already-computed answer-validity flag. Verified fixed via a clean re-run showing the correct causal order.
3. Two defects in the verification scripts themselves (not the application): a language-switch click selector that matched the wrong header button, and a screenshot-script selector that matched "reject all" instead of "customize" due to an ambiguous `:nth-of-type` + class combination. Both were caught by inspecting actual run output rather than assuming success, and fixed by targeting elements more precisely.

### Commands executed for Phase 11

- `npm.cmd run build`
- `npm.cmd run validate:content`
- `npm.cmd run validate:language`
- `npm.cmd run validate:quiz`
- `npm.cmd run validate:llm`
- `npm.cmd run validate:email`
- `npm.cmd run validate:analytics` (new)
- local dev server (`node server/devServer.mjs`) plus `vite preview`, driven over real HTTP/browser via dedicated Node/CDP scripts: one exercising a full realistic session (consent, navigation, language switch, CTA click, full Quiz completion, contact-form submission) while monitoring `Network.requestWillBeSent` for any request to a known tracking-vendor host, and one capturing screenshots of the consent banner's summary and preferences views

### Validation results

- Build, content validation, language validation, quiz-engine validation, LLM validation, and email validation: all still passed, confirming no regression to earlier phases.
- New analytics validation result: passed — 22 checks covering event-catalog completeness against the exact required 21-event list, the scope-decision regression guards (mock enabled / Google-Meta-TikTok disabled / no real ids configured / opt-in default consent), the prohibited-payload guard against every category of sensitive key, a consent-gating simulation across no-consent/analytics-only/full-consent scenarios, cookie-consent message parity in both languages, and the attribution/Quiz-LLM separation check. Full report: `docs/implementation/validation/phase-11/phase11-validation-report.json`.
- Browser verification: a full realistic session (consent accept, navigation, language switch, hero CTA click, complete 6-question Quiz through insight result, contact-form submission) produced the correctly ordered event sequence at every step, and the `Network.requestWillBeSent` listener recorded **zero** requests to any Google/Meta/TikTok tracking host across the entire session. Full report: `docs/implementation/validation/phase-11/phase11-analytics-check.json`. Screenshots of the consent banner's summary and preferences views were also captured and visually confirmed correct.

### Known issues and deferred items retained after Phase 11

- No real Google/Meta/TikTok container, measurement, or pixel id has ever been configured; activating any of them remains a future decision requiring explicit approval.
- Cookie consent copy is functional but has not had a legal/compliance review — an existing open item, not newly introduced by this phase.
- A dedicated concept-switching analytics test is deferred (low risk — the tracking chokepoint is concept-agnostic; exercised indirectly by every scenario above).
- Lint and test-runner tooling remain unavailable in the current repository.
- SEO, Google Search and AI Search Visibility (Phase 12) remains not started.

### Phase 11 exit-criteria result

- Consent-aware marketing measurement architecture (event catalog, provider abstraction, single tracking chokepoint, consent gating) is implemented and verified.
- Mock provider active by default; Google/Meta/TikTok providers exist as real code but are disabled and unconfigured — verified to never load a script or send a request.
- Cookie consent banner (summary + preferences, both languages) is implemented and verified, including default-opt-out consent state.
- Campaign attribution (UTM capture) is implemented, verified to persist across client-side redirects, and verified structurally separate from Quiz/LLM code.
- No personal data, Quiz answers, LLM prompt/result content, or credentials can reach any analytics payload.
- Zero real tracking network requests were observed across a full realistic browser session.
- No Phase 12 or later work was started. No Git modification was performed. No deployment was performed.

Recommended Phase 11 status:

- `READY FOR REVIEW`

Approval state:

- `User approved`

## 42. Phase 12 execution record

### Confirmed scope and guardrails for Phase 12

- User explicitly approved Phase 12 SEO, Google Search and AI Search Visibility on `2026-08-20`, in the same conversation turn as approving Phase 11 as complete.
- Before implementation, the user resolved three items from this phase's core open decisions (§20/§23). Crawlable rendering strategy: build-time pre-rendering via the existing local headless-browser (CDP) tooling already used for verification since Phase 7 — no new npm dependency, no conversion to server-side rendering. `OAI-SearchBot`/`GPTBot` policy: both explicitly allowed in `robots.txt`. Base domain: a clearly-fake placeholder (`https://www.huma-labs.example`), pending the separate final-domain decision (§23).
- No real production domain was ever used. No Phase 13 or later implementation work was started. Git publication work was not started. Deployment was not performed.

### Files created in Phase 12

- `config/seo.json`, `config/seo-pages.json`
- `src/seo/seo-config.ts`, `src/seo/DocumentHead.tsx`
- `scripts/generate-seo-files.mjs`, `scripts/prerender.mjs`, `scripts/validate-phase12.mjs`
- `docs/implementation/validation/phase-12/phase12-prerender-check.mjs` / `.json`
- `docs/implementation/validation/phase-12/phase12-validation-report.json`
- `docs/implementation/validation/phase-12/phase12-seo-report.md`
- `public/robots.txt`, `public/sitemap.xml` (generated on every build)

### Existing files changed in Phase 12

- `index.html`
- `src/components/SiteLayout.tsx`
- `src/i18n/language.tsx`
- `messages/he/seo.json`, `messages/en/seo.json`
- `package.json`
- `docs/implementation/huma-website-master-plan.md`

### Implementation outcome

- Built a page registry (`config/seo-pages.json`) and localized per-page metadata (extended `messages/{he,en}/seo.json`), reusing already-approved, already-live copy rather than inventing new marketing claims.
- Built `DocumentHead.tsx` as the single owner of every SEO-relevant `<head>` tag — title, description, robots, canonical, bidirectional `hreflang` (plus `x-default`), Open Graph, Twitter Card, and home-page-only Organization/WebSite structured data — and consolidated the pre-existing ad-hoc concept-preview `noindex` effect into it, removing a second independent writer of the same tag.
- Built `robots.txt`/`sitemap.xml` generation (`scripts/generate-seo-files.mjs`), wired into `npm run build`: explicit `OAI-SearchBot`/`GPTBot` allow directives per the confirmed decision, `/api/` and concept-preview query URLs disallowed, sitemap lists exactly the four indexable URLs with hreflang alternates.
- Built build-time pre-rendering (`scripts/prerender.mjs`), wired into `npm run build` after `vite build`: drives the local headless Edge browser to each indexable route and writes the fully-rendered HTML to the matching static file path in `dist/`, so real static HTML (not an empty SPA shell) is what a crawler receives — resolving the master plan's core "must not depend on crawlers executing complex client-side JavaScript" requirement.
- Kept the root `index.html` shell `noindex,follow` with a canonical hint to `/he`; it only serves the bare `/` and `/insight` compatibility-redirect routes (unchanged Phase 3 behavior) and is deliberately never linked to internally or listed in the sitemap. A real HTTP-level redirect for the bare domain root is left to Phase 16.

### Bugs found and fixed during this phase's own verification

1. An unconditional `<meta http-equiv="refresh">` added to the root shell as a no-JS crawler fallback interfered with the prerender process itself: `vite preview`'s SPA fallback serves that same shell for `/he`/`/en`/etc. before their real prerendered files exist, so the refresh fired mid-navigation during prerendering and corrupted every route's capture (empty, unrendered shell). Fixed by removing the meta-refresh; canonical + `noindex,follow` alone is a sufficient, non-self-interfering signal for the shell's narrow purpose, and a real server-side redirect for the bare root correctly belongs to Phase 16.
2. The static `robots`/`canonical`/`description` tags baked into `index.html` were never removed once `DocumentHead` added its own dynamic versions, so every real page carried two (conflicting) `robots` meta tags — a real indexability risk, since crawlers commonly treat conflicting robots directives as a union of restrictions. Fixed by tagging the static tags with the same `data-seo-managed="true"` marker `DocumentHead` uses, so they are cleanly removed on mount. Verified: exactly one of each tag remains on every rendered page.
3. `LanguageProvider`'s pre-existing `document.title` effect fired after `DocumentHead`'s (sitting higher in the provider tree) and overwrote every page's correct, specific title with the generic site title. Fixed by removing that now-redundant responsibility from `LanguageProvider`, making `DocumentHead` the sole title owner. Verified: `/he/insight` and `/en/insight` now show the correct Insight-specific title.
4. A verification-script defect (not an app bug): the first no-JS crawler-simulation check fetched routes against `vite preview`, whose SPA-fallback middleware intercepts every extension-less path before checking for an exact static-file match, masking the real prerendered files (returned the tiny root-shell body for every route). Fixed by switching the verification server to a minimal, dumb static-file server (exact-match-or-404) that correctly mirrors standard static-host serving behavior.

### Commands executed for Phase 12

- `npm.cmd run build` (now: `node scripts/generate-seo-files.mjs && tsc -b && vite build && node scripts/prerender.mjs`)
- `npm.cmd run validate:content`
- `npm.cmd run validate:language`
- `npm.cmd run validate:quiz`
- `npm.cmd run validate:llm`
- `npm.cmd run validate:email`
- `npm.cmd run validate:analytics`
- `npm.cmd run validate:seo` (new)
- `node docs/implementation/validation/phase-12/phase12-prerender-check.mjs` — a non-JS HTTP fetch of all four indexable routes plus `robots.txt`/`sitemap.xml` against a plain static server serving the real `dist/` build output
- a dedicated browser check confirming the concept-preview `noindex` guardrail still holds after consolidating that logic into `DocumentHead`

### Validation results

- Build (now including SEO-file generation and prerendering), content validation, language validation, quiz-engine validation, LLM validation, email validation, and analytics validation: all still passed, confirming no regression to earlier phases.
- New SEO validation result: passed — 18 checks covering page-registry completeness, the `OAI-SearchBot`/`GPTBot`-allow and placeholder-domain regression guards, `robots.txt` and `sitemap.xml` content, localized metadata completeness, a canonical/hreflang logic simulation, and a structured-data field allowlist (no fabricated claims). Full report: `docs/implementation/validation/phase-12/phase12-validation-report.json`.
- Production-like, no-JS browser verification: all four indexable routes (`/he`, `/en`, `/he/insight`, `/en/insight`) returned real, substantial HTML (9.7–24.8 KB) over a plain HTTP fetch that never executes JavaScript, each with the correct title, real visible text, exactly one `robots` meta tag (`index,follow`), exactly one canonical link, 3 `hreflang` alternates including `x-default`, and structured data present only on the home routes. `robots.txt` correctly allows `OAI-SearchBot` and `GPTBot`; `sitemap.xml` contains exactly the 4 expected URLs. Full report: `docs/implementation/validation/phase-12/phase12-prerender-check.json`. The pre-existing concept-preview `noindex` guardrail was separately confirmed still correct after the `DocumentHead` consolidation.

### Known issues and deferred items retained after Phase 12

- The final production domain remains an open decision (§23); the placeholder appears in exactly two places (`config/seo.json` and a hardcoded canonical href in `index.html`) that must be updated at deployment time.
- No Open Graph/social image was added — "social images" is an explicit open decision (§23) and no real, approved image asset exists yet.
- A real HTTP-level redirect for the bare domain root remains a Phase 16 (hosting/deployment) decision.
- Search Console ownership, SEO monitoring frequency, approved keyword targets, and public organization/About/knowledge-section content all remain open decisions (§23) outside this phase's engineering scope.
- Lint and test-runner tooling remain unavailable in the current repository.
- Responsive, Accessibility and Full QA (Phase 13) remains not started.

### Phase 12 exit-criteria result

- Crawlable rendering strategy is implemented and verified via a genuine non-JS-executing HTTP fetch against production-like static output.
- Canonical rules, `hreflang` (bidirectional + x-default), and localized metadata are implemented and verified for every indexable page in both languages.
- `robots.txt` and `sitemap.xml` are implemented, valid, and verified, including the explicit `OAI-SearchBot`/`GPTBot` allow decision.
- Structured data is present only on the home page and contains only already-approved, already-visible facts.
- Concept-preview URLs remain `noindex,nofollow` and excluded from the sitemap and from `robots.txt`'s crawlable set.
- No private/dynamic result content is indexed or included in the sitemap.
- No Phase 13 or later work was started. No Git modification was performed. No deployment was performed.

Recommended Phase 12 status:

- `READY FOR REVIEW`

Approval state:

- `User approved`

## 43. Phase 13 execution record

### Confirmed scope and guardrails for Phase 13

- User explicitly approved Phase 13 Responsive, Accessibility and Full QA on `2026-08-20`, in the same conversation turn as approving Phase 12 as complete.
- Before implementation, the user was asked how to build accessibility auditing, since the repository had no automated testing tooling installed at all up to this point. Decision: install `axe-core` (industry-standard, open-source) as a dev-only dependency, run entirely through the existing local headless-browser (CDP) verification tooling — no runtime/production footprint.
- This phase is a QA/validation sweep over Phases 4-12, not a new-feature phase, per the master plan's own phase-order scoping. No new production features were added. No Phase 14 or later implementation work was started. Git publication work was not started. Deployment was not performed.

### Files created in Phase 13

- `docs/implementation/validation/phase-13/phase13-qa-check.cjs` / `.json`
- `docs/implementation/validation/phase-13/phase13-validation-report.json`
- `docs/implementation/validation/phase-13/phase13-qa-report.md`
- `docs/implementation/validation/phase-13/phase13-*.png` (16 responsive screenshots + 4 targeted state screenshots)
- `scripts/validate-phase13.mjs`

### Existing files changed in Phase 13

- `package.json`
- `src/styles.css`
- `messages/he/navigation.json`, `messages/en/navigation.json`
- `src/concepts/concept-a/components/ConceptAHeader.tsx`, `ConceptAFooter.tsx`
- `src/concepts/concept-c/components/ConceptCHeader.tsx`, `ConceptCFooter.tsx`
- `src/pages/InsightPage.tsx`
- `docs/implementation/huma-website-master-plan.md`

### Implementation outcome

- Built one comprehensive QA sweep script driving a single headless-browser session across: all 8 concept×language×page combinations at mobile and desktop viewports (16 axe-core audits + 16 screenshots), the cookie-consent banner's pre-accept accessibility state, an in-progress Quiz question, the dynamic Insight result screen, a Concept-A-vs-Concept-C content-parity comparison, a full-session tracking-safety regression check extended to Concept C, and a new Concept C contact-form failure-state check.
- Added `scripts/validate-phase13.mjs` (`npm run validate:qa`) as a lightweight structural regression guard re-checking the fixes below stay in place and the most recent QA-sweep evidence stays clean.

### Real defects found and fixed during this phase

1. **Insufficient color contrast (WCAG AA, `serious`)**: the filled form-submit button used white text on `--color-accent`, a 3.97:1 ratio against the 4.5:1 AA requirement. Fixed by switching to the darker `--color-accent-deep` (~5.9:1, verified via manual WCAG luminance calculation) with a new, distinctly darker hover shade for continued visual feedback. Confirmed the only other uses of `--color-accent` in the stylesheet are decorative (no overlaid text).
2. **Duplicate/non-unique navigation landmarks (`moderate`)**: the header's desktop nav, mobile-menu nav, and footer nav all shared the same `aria-label`, making them indistinguishable to screen-reader users when more than one was simultaneously present in the accessibility tree (e.g. header + footer nav at desktop viewport width). Fixed by adding two new distinct message keys (`aria.primaryMobile`, `aria.primaryFooter`) in both languages, wired into both concepts' header and footer components.
3. **Missing level-one heading (`moderate`)**: the Insight route had no `<h1>` in any of its 6 page-state/concept render branches (its section components correctly use `<h2>`/`<h3>` for state-scoped headings, not page-level ones). Fixed with a single persistent, visually-hidden `<h1>` (existing `.sr-only` utility) defined once and referenced from all 6 branches in `InsightPage.tsx`, rather than special-casing heading levels across 6+ different section components.

All three were re-verified with a targeted axe re-run immediately after the fix, then reconfirmed in the full final QA sweep.

### Commands executed for Phase 13

- `npm.cmd install --save-dev axe-core`
- `npm.cmd run build`
- `npm.cmd run validate:content`
- `npm.cmd run validate:language`
- `npm.cmd run validate:quiz`
- `npm.cmd run validate:llm`
- `npm.cmd run validate:email`
- `npm.cmd run validate:analytics`
- `npm.cmd run validate:seo`
- `npm.cmd run validate:qa` (new)
- local dev server (`node server/devServer.mjs`, `CONTACT_NOTIFICATION_EMAIL` intentionally left unset) plus `vite preview`, driven by `docs/implementation/validation/phase-13/phase13-qa-check.cjs` for the full responsive/accessibility/parity/tracking/failure-state sweep, run twice (before and after the three fixes)

### Validation results

- Build, content validation, language validation, quiz-engine validation, LLM validation, email validation, analytics validation, and SEO validation: all still passed, confirming no regression to earlier phases.
- Final full QA sweep: **zero axe-core violations** (critical/serious/moderate/minor) across all 16 mobile+desktop page renders, the consent banner, the in-progress Quiz question, and the dynamic Insight result screen; RTL/LTR `dir`/`lang` correct on all 8 matrix combinations; no console errors on any navigation; 94.7% content-word overlap between Concept A and Concept C's home pages (no major drift); zero real tracking requests across the entire session including Concept C (extending Phase 11's Concept-A-only evidence); the Concept C contact-form failure state renders its accessible error message correctly (confirmed by screenshot). Full report: `docs/implementation/validation/phase-13/phase13-qa-check.json`.
- New `validate:qa` result: passed — 11 checks covering the `axe-core` dependency, the three distinct navigation labels, the contrast and heading fixes staying in place, and the latest QA-sweep evidence staying clean. Full report: `docs/implementation/validation/phase-13/phase13-validation-report.json`.

### Known issues and deferred items retained after Phase 13

- Automated `axe-core` auditing does not certify full WCAG conformance; manual checks (screen-reader walkthroughs, keyboard-only navigation testing) were not performed and remain a documented gap, not a compliance claim.
- Concept parity was verified via a word-overlap heuristic, not an exhaustive field-by-field content diff.
- A verification-script selector gap (not an app bug) meant the raw QA-check JSON's `contactFormFailure.statusText` field captured the wrong DOM element; the real failure message was independently confirmed via the saved screenshot.
- Final Concept Decision (Phase 14), Git and GitHub (Phase 15), and Vercel Deployment (Phase 16) remain not started.

### Phase 13 exit-criteria result

- Responsive behavior is verified across both concepts, both languages, and both indexable pages at mobile and desktop viewports, with screenshot evidence.
- Accessibility is verified via automated `axe-core` audits across the full matrix plus dynamic Quiz/result/failure states, with zero violations after fixing three real, pre-existing defects.
- Bilingual/RTL-LTR behavior is verified correct on every page in the matrix.
- Concept parity (no major content drift) is verified.
- Tracking safety is re-verified with zero real tracking requests, now covering both concepts.
- Crawlability continues to pass its own validator with no regression.
- Failure states are verified accessible on a previously-untested concept.
- No Phase 14 or later work was started. No Git modification was performed. No deployment was performed.

Recommended Phase 13 status:

- `READY FOR REVIEW`

Approval state:

- `User approved`

## 44. Phase 14 execution record

### Confirmed scope and guardrails for Phase 14

- User explicitly approved Phase 14 Final Concept Decision on `2026-08-20`, in the same conversation turn as approving Phase 13 as complete.
- Unlike every prior phase, Phase 14 is a decision phase, not an implementation phase — per the master plan's own phase-order scoping ("Confirm the final production concept direction after QA evidence and stakeholder review"). The final-concept choice is a stakeholder/design decision that cannot and should not be made by the implementing agent; the user was shown representative Phase 13 screenshots of both concepts and asked to choose.
- **Confirmed final production concept: Concept A.**
- The user was also asked whether Phase 14 should remove Concept C's implementation now or only record the decision. Decision: record only — Concept C's code is explicitly retained in the codebase; no removal was performed. `siteConfig.defaultConcept` was checked and already equaled `"a"`, so no code change was required to enact the decision.
- No Phase 15 or later implementation work was started. No Git modification was performed. No deployment was performed.

### Files created in Phase 14

- `scripts/validate-phase14.mjs`
- `docs/implementation/validation/phase-14/phase14-validation-report.json`
- `docs/implementation/validation/phase-14/phase14-concept-decision-report.md`

### Existing files changed in Phase 14

- `package.json` (added `validate:concept-decision` script)
- `docs/implementation/huma-website-master-plan.md`

### Implementation outcome

- No application code changes were required: `siteConfig.defaultConcept` (`src/config/site.ts`) already equaled `"a"`, matching the confirmed decision.
- Added `scripts/validate-phase14.mjs` (`npm run validate:concept-decision`) as a lightweight regression guard: confirms `defaultConcept` still matches the confirmed decision, confirms Concept C's implementation directory is still present (guards against accidental future deletion contradicting the "retain, don't remove" decision), and confirms the master plan records the resolved decision rather than still listing it as an open Phase 14 item.
- Updated the master plan's §30 "Deferred decisions and later-phase blockers" entries specific to the final-concept decision to reflect resolution (left all other, unrelated deferred-decision entries in that section untouched, as those belong to other phases).

### Commands executed for Phase 14

- `npm.cmd run build`
- `npm.cmd run validate:content`
- `npm.cmd run validate:language`
- `npm.cmd run validate:quiz`
- `npm.cmd run validate:llm`
- `npm.cmd run validate:email`
- `npm.cmd run validate:analytics`
- `npm.cmd run validate:seo`
- `npm.cmd run validate:qa`
- `npm.cmd run validate:concept-decision` (new)

### Validation results

- Build and all eight prior validators: all still passed, confirming no regression — expected, since this phase made no application-code changes.
- New concept-decision validation result: passed — confirms `defaultConcept` matches the decision, Concept C's implementation remains present in the codebase, and the master plan records the resolved decision. Full report: `docs/implementation/validation/phase-14/phase14-validation-report.json`.

### Known issues and deferred items retained after Phase 14

- Concept C's implementation remains in the codebase, unused in production routing but not deleted — an explicit, documented decision, not an oversight. Its eventual removal (if ever desired) is left to a future, explicitly-approved cleanup, not implied by this phase.
- Git and GitHub (Phase 15) and Vercel Deployment (Phase 16) remain not started.

### Phase 14 exit-criteria result

- The final production concept direction is confirmed by the user after reviewing Phase 13's QA evidence: **Concept A**.
- `siteConfig.defaultConcept` matches the decision (verified, no change needed).
- The non-selected concept (C) is retained in the codebase per explicit user instruction, not removed.
- The master plan records the decision and its rationale.
- No Phase 15 or later work was started. No Git modification was performed. No deployment was performed.

Recommended Phase 14 status:

- `READY FOR REVIEW`

Approval state:

- `User approved`

## 45. Phase 15 execution record

### Confirmed scope and guardrails for Phase 15

- User explicitly approved Phase 15 Git and GitHub on `2026-08-20`, in the same conversation turn as approving Phase 14 as complete.
- Before implementation, the user was asked how to build the initial Git history, since the repository had never been under version control (no `.git` existed, confirmed via `git status` returning "not a git repository"). Decision: a single clean initial commit representing the current final state — not a fabricated, retroactive per-phase commit history, since the actual work was not done through Git in sequence and reconstructing "Phase N" commit messages against the final file contents would be misleading, not genuinely historical.
- The user was also asked about GitHub publication readiness, since `gh` CLI is not installed in this environment and the agent had no way to know whether a repository already existed. The user confirmed an existing repository at `https://github.com/AlexPaks/huma-labs-site` and provided its URL. `git ls-remote` against that URL (read-only, no local state changed) confirmed it was completely empty before any local Git operation — no risk of overwriting existing remote history.
- No deployment was performed (guardrail #10, "GitHub and deployment remain prohibited before their phases" — GitHub is now in scope for this phase; deployment remains Phase 16's).

### Files created in Phase 15

- `README.md`
- `scripts/validate-phase15.mjs`
- `docs/implementation/validation/phase-15/phase15-validation-report.json`
- `docs/implementation/validation/phase-15/phase15-git-github-report.md`

### Existing files changed in Phase 15

- `.gitignore` (added `.claude/`)
- `package.json` (added `validate:git` script)
- `docs/implementation/huma-website-master-plan.md`

### Files removed in Phase 15

- `vite.config.js`, `vite.config.d.ts` — stray, unreferenced build byproducts (a previous `tsc` run had accidentally compiled `vite.config.ts` into these files at the repository root; nothing imports them, and `vite.config.ts` is the only file Vite's dev/build/preview commands actually load). Confirmed unreferenced via a repo-wide grep before deletion, and confirmed `tsc -b` still passes cleanly after removal.

### Implementation outcome

- Reviewed the pre-existing `.gitignore` (created in an earlier phase) and confirmed it already correctly excludes `node_modules/`, `dist/`, `.env`/`.env.*` (with an explicit `.env.example` allow-exception), `*.tsbuildinfo`, and `.tmp-vite-*.log`. Added `.claude/` (this tool's local session settings, analogous to `.vscode/settings.json` — machine-specific, never meant for a shared repository).
- Scanned for any real `.env`/secret files before staging anything; only the placeholder `.env.example` (no real credentials) exists on disk.
- Removed the two stray build-artifact files described above.
- Ran `git init -b main`, staged everything with `git add -A`, and reviewed the staged file list (355 files) by top-level directory before committing — confirmed no `node_modules/`, `dist/`, `.env`, `.claude/`, or `.tsbuildinfo` entries were staged.
- Created the initial commit summarizing the full Phase 0-14 history and explicitly restating the "no real credentials, no real network calls, no deployment" guardrail record in the commit message itself.
- Added a `README.md` (setup instructions, script reference, project structure, current phase status, guardrail summary) as a second commit — kept separate from the initial commit per this tool's own git-safety convention of never bundling unrelated changes into a single commit after the fact.
- Added `origin` pointing at the user-provided GitHub repository URL.
- Attempted `git push -u origin main`; it hung waiting on an interactive Windows Credential Manager (`wincred`) authentication prompt this tool's non-interactive shell cannot display, and was terminated by a command timeout. No partial or corrupted state resulted — `git status` afterward confirmed a clean working tree and both commits intact. The user was informed and explicitly chose to run the push themselves in their own interactive terminal, where the credential prompt can be answered.
- Added `scripts/validate-phase15.mjs` (`npm run validate:git`) as a regression guard: repository initialized, on `main`, at least one commit, `origin` matches the confirmed URL, working tree clean, the five key `.gitignore` patterns present, no `node_modules`/`dist`/`.env` files tracked, `.claude/` not tracked, `package-lock.json` tracked, and `README.md` exists.

### Commands executed for Phase 15

- `git ls-remote https://github.com/AlexPaks/huma-labs-site` (read-only, confirmed the remote was empty before any local operation)
- `git init -b main`
- `git add -A`, `git status --short` (reviewed before committing)
- `git commit` ×2 (initial commit; README commit)
- `git remote add origin https://github.com/AlexPaks/huma-labs-site`
- `git push -u origin main` (did not complete — see above)
- `npm.cmd run build`
- `npm.cmd run validate:content` through `npm.cmd run validate:concept-decision` (all 9 prior validators)
- `npm.cmd run validate:git` (new)

### Validation results

- Build and all nine prior validators: all still passed, confirming no regression — the only application-affecting change this phase made was removing two unused stray build-artifact files, already confirmed safe via a clean `tsc -b` run.
- New Git validation result: passed once the Phase 15 deliverables (this validator, the README, the `package.json` script, and this master-plan update) were committed as a third commit — repository initialized on `main`, two prior commits present, `origin` correctly configured, working tree clean, all five key `.gitignore` patterns present, no unwanted files tracked, `package-lock.json` tracked, `README.md` present. Full report: `docs/implementation/validation/phase-15/phase15-validation-report.json`.

### Known issues and deferred items retained after Phase 15

- **The actual `git push` to GitHub has not completed.** The user must run `git push -u origin main` in their own interactive terminal from `D:\alexp\HumaLab Projects\huma-labs-site`; Windows Credential Manager will prompt for GitHub authentication at that point.
- Branch-protection rules, PR templates, and CI configuration were not set up — not requested and not implied by "PR readiness" at this stage (there is nothing to open a PR against yet, since this is the initial publication).
- Vercel Deployment (Phase 16) remains not started, and remains explicitly prohibited until then.

### Phase 15 exit-criteria result

- A Git repository exists locally with a clean, reviewed initial history on `main`.
- No secrets, dependencies, or build output were committed — verified via an explicit pre-commit review and a post-commit regression-guard script.
- The `origin` remote is configured against the user's confirmed, pre-verified-empty GitHub repository.
- `README.md` and version-control regression-guard tooling are in place for PR readiness.
- The actual push to GitHub is explicitly deferred to the user, by their own choice, for an environment-specific authentication reason — not silently skipped or claimed as done.
- No Phase 16 work was started. No deployment was performed.

Recommended Phase 15 status:

- `READY FOR REVIEW`

Approval state:

- `Pending user review`

## 46. Phase 15.5 execution record

### Confirmed scope and guardrails

- The user selected the second structural photo-led improvement direction, named it `Concept D`, and explicitly requested that it become the default.
- Existing content, routes, forms, assessment logic, analytics, SEO, Hebrew RTL, and section order remained unchanged.
- Concept A and Concept C were retained and remain available as `?concept=a` and `?concept=c` previews.
- No Git commit, push, package installation, or deployment was performed.

### Implementation outcome

- Added `d` to `SupportedConcept` and concept resolution.
- Set `siteConfig.defaultConcept` to `"d"`.
- Added a Concept D review-switcher option in Hebrew and English.
- Implemented Concept D as a responsive presentation layer over the existing Concept A semantic component structure, preserving the site's information architecture.
- Persisted four production photographic assets under `public/images/concept-d/`.
- Persisted the approved desktop direction at `docs/design-concepts/images/concept-d-home-desktop.png`.
- Added `scripts/validate-phase15-5.mjs` and `npm run validate:concept-d`.

### Validation evidence

- `npm.cmd run build`: passed.
- `npm.cmd run validate:content`: passed.
- `npm.cmd run validate:language`: passed.
- Local Edge CDP browser QA: passed for Hebrew/English and desktop/mobile.
- All four Concept D image assets loaded successfully.
- No horizontal overflow, framework overlay, or console errors were found.
- Concept A and Concept C preview routes remain functional and `noindex,nofollow`.
- Home-to-Organizational-Insight navigation retained Concept D.

Primary evidence:

- `docs/implementation/validation/phase-15.5/phase15-5-concept-d-report.md`
- `docs/implementation/validation/phase-15.5/phase15-5-concept-d-check.json`
- `docs/implementation/validation/phase-15.5/phase15-5-validation-report.json`
- `docs/implementation/validation/phase-15.5/concept-d-he-home-full.png`

### Exit-criteria result

- Concept D is implemented and selected as the default.
- The approved structure and meaning are preserved.
- Desktop/mobile and RTL/LTR evidence is saved.
- Earlier concepts remain available for review.
- Phase 16 was not started and no deployment was performed.

Recommended Phase 15.5 status:

- `READY FOR REVIEW`

Approval state:

- `Pending user review`

## 47. Phase 15.6 execution record and Phase 16 readiness

### Confirmed scope and guardrails

- On `2026-08-23`, the user requested that the completed Brevo email work be formalized as `Phase 15.6` and that the workspace be prepared for Phase 16.
- Phase 15.6 includes transactional email provider implementation and no-network validation only.
- SMS, Brevo marketing, Vercel linking, environment upload, Preview deployment, production deployment, domain changes, and provider calls remain outside this phase.
- Phase 16 remains `NOT STARTED` and requires explicit execution approval.

### Phase 15.6 implementation

- Added a direct Brevo Transactional Email provider behind the existing email-provider contract.
- Preserved mock and SMTP alternatives, existing contact and Insight endpoints, validation schemas, templates, rate limits, and honeypot behavior.
- Added sandbox-first configuration and dedicated `validate:phase15-6` evidence.
- Added `server:dev:env` so the local API can load gitignored `.env.local` explicitly.
- No real Brevo request or email delivery occurred.

### Credential correction

- Readiness inspection found real OpenAI and Brevo values in the working-tree `.env.example`.
- Values were moved to gitignored `.env.local`; `.env.example` was restored to empty mock-first defaults.
- Read-only inspection found no secret values in Git `HEAD` or repository history.
- Both credentials must be revoked and replaced because they appeared in command output.

### Phase 16 readiness result

Prepared:

- Production build path and Vercel SPA configuration exist.
- Vercel Node adapters exist for all three API routes.
- Production environment-variable inventory is documented.
- Automated readiness audit is available as `npm run validate:phase16-readiness`.

Blocking Phase 16 execution:

1. Rotate OpenAI and Brevo credentials.
2. Approve and configure the final production domain instead of `huma-labs.example`.
3. Review, approve, commit, and push Phase 15.6.
4. Install or invoke a pinned Vercel CLI and link the intended project.
5. Configure sensitive Production/Preview environment variables.
6. Create and validate a Preview deployment before production promotion.
7. Verify browser routes, APIs, OpenAI, Brevo, SEO output, and Vercel logs.

Primary evidence:

- `docs/implementation/validation/phase-15.6/phase15-6-brevo-email-report.md`
- `docs/implementation/validation/phase-15.6/phase15-6-validation-report.json`
- `docs/implementation/validation/phase-16-readiness/phase16-readiness-report.md`
- `docs/implementation/validation/phase-16-readiness/phase16-readiness-report.json`

Recommended Phase 15.6 status:

- `READY FOR REVIEW`

Phase 16 status:

- `NOT STARTED`

