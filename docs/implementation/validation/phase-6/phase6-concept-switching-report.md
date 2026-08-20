# Phase 6 — Concept Switching Verification Report

Date: 2026-08-19
Phase: Phase 6 - Concept Switching

## Scope implemented

- `?concept=a` / `?concept=c` query-based switching (already present from Phase 5) retained.
- `localStorage` persistence of the reviewer's concept preference, key `huma-concept`, mirroring the existing `huma-language` pattern in `src/i18n/language.tsx`.
- Precedence order: explicit `?concept=` query value > stored preference > `siteConfig.defaultConcept`.
- An internal concept-review switcher (`ConceptReviewSwitcher.tsx`), gated by `siteConfig.showConceptSwitcher` (default `false` — hidden outside review sessions, matching the master plan's "not part of the public HUMA marketing message" rule).
- Concept switching is implemented through a new `ConceptProvider` React context (`src/concepts/conceptMode.tsx`, converted from a plain-function module to a provider + hooks) so the active concept and the switch action are available without prop drilling, and so switching does not remount the route tree (preserving component state, including in-progress Quiz state).
- No duplicate canonical/indexing concern: the existing `SiteLayout.tsx` noindex-meta logic (`currentConcept !== siteConfig.defaultConcept`) was already concept-agnostic and required no change.
- Duplicate analytics: not applicable yet — Phase 11 (Marketing Analytics) has not started, so there is no analytics events layer to duplicate. This is a deferred check, to be revisited when Phase 11 is implemented.

## Bug found and fixed during verification

- `withRetainedConceptSearch` (used by `localizeHref` for in-page links such as the Contact CTA) built malformed URLs when the target path already contained a hash fragment, e.g. `/he#contact?concept=c` instead of `/he?concept=c#contact`. The query string ended up appended after the hash, so `concept=c` was swallowed into the hash text instead of being read as a real query parameter.
- Root cause: naive string concatenation (`${path}${retainedSearch}`) with no awareness of an existing `#` in `path`.
- Fix: `withRetainedConceptSearch` now splits the path at its first `#`, inserts the retained search before the hash, and reassembles it. Verified directly: the Contact link's `href` while Concept C is active is now `/he?concept=c#contact`.

## Verification performed

Commands:
- `npm.cmd run build` -> Pass
- `npm.cmd run validate:content` -> Pass
- `npm.cmd run validate:language` -> Pass

Browser verification (local Microsoft Edge headless via CDP, `docs/implementation/validation/phase-6/phase6-switcher-check.cjs`, results in `phase6-switcher-check.json`):

| Check | Result |
| --- | --- |
| Default concept on first load (no query, no storage) | `a` — matches `siteConfig.defaultConcept` |
| Clicking the switcher's "Concept C" option | URL updates to `?concept=c`; `localStorage["huma-concept"]` set to `"c"` |
| Reload with no `?concept=` query after switching to C | Concept stays `c` (resolved from storage) |
| Clicking back to "Concept A" | URL query param removed (A is default); storage updates to `"a"` |
| Quiz state mid-flow, switch C -> A | Question index (`שאלה 2 מתוך 6`) preserved, no reset |
| Quiz state mid-flow, switch A -> C | Question index preserved switching back |
| Contact CTA href while Concept C is active | `/he?concept=c#contact` (correct query-before-hash ordering, after the fix above) |

Screenshots:
- `docs/implementation/validation/phase-6/switcher-he.png` — switcher visible (temporarily enabled via `showConceptSwitcher: true` for this capture only; reverted to `false` before finalizing).
- `docs/implementation/validation/phase-6/switcher-hidden-by-default.png` — confirms the switcher renders nothing when the flag is `false` (the shipped default), with no layout regression.

## Files created

- `src/shared/components/ConceptReviewSwitcher.tsx`
- `docs/implementation/validation/phase-6/phase6-switcher-check.cjs`
- `docs/implementation/validation/phase-6/phase6-switcher-check.json`
- `docs/implementation/validation/phase-6/switcher-he.png`
- `docs/implementation/validation/phase-6/switcher-hidden-by-default.png`
- `docs/implementation/validation/phase-6/phase6-concept-switching-report.md` (this file)

## Files changed

- `src/concepts/conceptMode.ts` -> renamed to `src/concepts/conceptMode.tsx` (added `ConceptProvider`, `useConceptSwitcher`, localStorage persistence, and the hash/query ordering fix in `withRetainedConceptSearch`)
- `src/app/AppProviders.tsx` (wired `ConceptProvider` inside `BrowserRouter`)
- `src/components/SiteLayout.tsx` (renders `ConceptReviewSwitcher` when `siteConfig.showConceptSwitcher` is true)
- `messages/he/system.json`, `messages/en/system.json` (added `conceptSwitcher.label` / `.optionA` / `.optionC`)
- `src/styles.css` (added `.concept-review-switcher` styles)

## Known deviations / deferred items

- Duplicate-analytics safety for concept switching cannot be fully verified until Phase 11 exists; documented as deferred rather than skipped.
- The switcher's visual design is intentionally neutral/utility (dark pill, no Concept A/C styling) since the master plan states it is not part of the public marketing message.

## Exit-criteria result

- `?concept=a` / `?concept=c` switching works.
- `localStorage` persistence works.
- Configurable default concept works (`siteConfig.defaultConcept`).
- Internal review switcher implemented and hideable via config (default hidden).
- Switching preserves in-progress Quiz state in both directions.
- No duplicate canonical URLs introduced (existing noindex logic already concept-aware).
- A real pre-existing URL-construction bug affecting hash-based concept-aware links was found and fixed during this phase's own verification.
- No Phase 7 or later work was started.
- Git was not modified. Deployment was not performed.

Recommended Phase 6 status: `READY FOR REVIEW`
