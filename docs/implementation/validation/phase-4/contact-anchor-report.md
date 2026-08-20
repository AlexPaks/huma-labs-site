# Concept A Localized Contact Anchor Correction Report

Date: 2026-08-18  
Phase: Phase 4 - Concept A Implementation  
Browser plugin availability: `not available in this session`  
Browser method used: `local Microsoft Edge headless via CDP`

## Scope

This was a targeted Phase 4 correction for broken localized Contact hash navigation.

Explicitly preserved during the correction:

- existing Contact content and form architecture
- Concept A implementation scope
- Hebrew and English localized routing
- RTL and LTR behavior
- Phase 5 status as `NOT STARTED`

## Root cause confirmed before code changes

Inspected files:

- `src/app/AppRoutes.tsx`
- `src/i18n/language.tsx`
- `src/components/SiteLayout.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/InsightPage.tsx`
- `src/concepts/concept-a/components/ConceptAHeader.tsx`
- `src/concepts/concept-a/components/ConceptAFooter.tsx`
- `src/concepts/concept-a/sections/HomeHeroSection.tsx`
- `src/concepts/concept-a/sections/InsightOverviewSection.tsx`
- `src/concepts/concept-a/sections/OutcomesContactSection.tsx`
- `src/styles.css`
- `content/site-structure.json`
- `messages/he/navigation.json`
- `messages/en/navigation.json`

Confirmed findings:

- The actual Contact target already existed once as `id="contact"` in `OutcomesContactSection`.
- Localized href generation already produced `/he#contact` and `/en#contact`.
- No duplicate `contact` IDs were present in the rendered structure.
- No shared route/hash-aware scroll mechanism existed in `SiteLayout` or the router layer.
- No code was found that waited for the Contact target to mount after navigating from Insight to Home.
- The sticky header was a secondary visibility consideration, not the primary defect.

Browser baseline evidence from `contact-anchor-check-before.json` confirmed the real failure pattern:

- direct `/he#contact` and `/en#contact` preserved the hash but stayed at `scrollY: 0`
- same-page Contact navigation preserved the hash but stayed at `scrollY: 0`
- Insight-to-Home Contact navigation preserved the hash but stayed at `scrollY: 0`
- refresh with the hash preserved the hash but stayed at `scrollY: 0`

Confirmed root cause:

- React Router navigation updated the localized URL hash correctly, but the application had no shared mechanism to scroll after SPA route/hash changes or after delayed Contact mounting.

## Correction implemented

Application changes:

- Added `src/components/HashScrollManager.tsx`
- Mounted `HashScrollManager` in `src/components/SiteLayout.tsx`
- Added Contact scroll offset support in `src/styles.css`

Shared behavior implemented:

- On route/hash changes, the app now performs bounded `requestAnimationFrame` retries until the hash target exists.
- Scrolling happens only after the actual target is found.
- Same-path repeated clicks on the same hash are handled through one centralized document-level anchor listener instead of separate ad hoc handlers on each Contact link.
- Sticky-header offset is applied during hash scrolling.
- Browser `POP` navigation from the hashed homepage back to the same localized homepage restores the earlier non-hash scroll position.
- Scrolling uses deterministic `auto` behavior for reliable direct-entry, refresh, and automated verification behavior.

## Final verification

Build and validations:

- `npm.cmd run build` -> Pass
- `npm.cmd run validate:content` -> Pass
- `npm.cmd run validate:language` -> Pass

Primary verification routes:

- `http://localhost:5173/he#contact`
- `http://localhost:5173/en#contact`
- same-page Contact from `/he`
- same-page Contact from `/en`
- Contact from `/he/insight`
- Contact from `/en/insight`
- direct entry with hash
- refresh with hash
- browser Back and Forward on the localized homepage

Final browser verification record from `contact-anchor-check.json`:

- `directHe`: pass
- `directEn`: pass
- `sameRouteHeFirst`: pass
- `sameRouteHeRepeat`: pass
- `sameRouteEnFirst`: pass
- `sameRouteEnRepeat`: pass
- `crossRouteHe`: pass
- `crossRouteEn`: pass
- `refreshHe`: pass
- `refreshEn`: pass
- `historyBack`: pass for localized route restoration to `/he` with hash removed and Contact no longer visible
- `historyForward`: pass for localized route restoration to `/he#contact` with Contact visible again
- console errors: none relevant
- duplicate `#contact` IDs: none

## Saved evidence

Browser evidence files:

- `docs/implementation/validation/phase-4/contact-anchor-check-before.json`
- `docs/implementation/validation/phase-4/contact-anchor-check.json`
- `docs/implementation/validation/phase-4/contact-anchor-he-direct.png`
- `docs/implementation/validation/phase-4/contact-anchor-en-direct.png`
- `docs/implementation/validation/phase-4/contact-anchor-he-repeat.png`
- `docs/implementation/validation/phase-4/contact-anchor-en-repeat.png`
- `docs/implementation/validation/phase-4/contact-anchor-he-from-insight.png`
- `docs/implementation/validation/phase-4/contact-anchor-en-from-insight.png`

Visual review summary:

- Saved screenshots opened successfully.
- No screenshot crop or corruption was observed.
- Contact remained reachable below the sticky header in Hebrew and English.

## Status impact

- Phase 4 remains `COMPLETED`
- Approval is `User approved` on `2026-08-18`
- Phase 5 remains `NOT STARTED`
- No deployment was performed
- Git was not modified
