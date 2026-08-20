# Phase 12 — SEO, Google Search and AI Search Visibility Verification Report

Date: 2026-08-20
Phase: Phase 12 - SEO, Google Search and AI Search Visibility

## Scope decisions confirmed with the user

1. The user approved Phase 11 as complete and approved starting Phase 12.
2. Crawlable rendering strategy (§20/§23's central open decision): build-time pre-rendering via the existing local headless-browser tooling (the same Edge/CDP pattern already used for verification since Phase 7), producing real static HTML per indexable route with no new npm dependency and no conversion to a Node SSR application — deferring that heavier architectural change to a later, explicitly-approved decision if ever needed.
3. `OAI-SearchBot` / `GPTBot` policy: both explicitly allowed in `robots.txt`.
4. Base domain for canonical/hreflang/sitemap/Open Graph URLs: a clearly-fake placeholder, `https://www.huma-labs.example`, mirroring the `internal@huma.example` pattern from Phase 10 — to be swapped for the real domain once §23's "final domain" decision is made, at deployment time.

## What was implemented

- **Page registry and localized metadata**: `config/seo-pages.json` declares the two indexable pages (`home`, `insight`) with priority/changefreq; `messages/{he,en}/seo.json` was extended with a `title`/`description` per page, per language — reusing copy that was already approved and live (the home description is verbatim the description already in `index.html` since Phase 1; the insight description is verbatim the Insight page's own hero copy), never inventing new marketing claims.
- **`DocumentHead` component** (`src/seo/DocumentHead.tsx`), rendered once in `SiteLayout.tsx`, is now the single owner of every SEO-relevant `<head>` tag: `<title>`, meta description, `robots` (index/follow or noindex/nofollow), canonical link, bidirectional `hreflang` alternates (`he`, `en`, and `x-default` pointing at the default language), Open Graph (`og:title/description/url/type/site_name/locale/locale:alternate`), Twitter Card meta, and — on the home page only — an Organization + WebSite JSON-LD structured-data block built strictly from already-approved, already-visible copy (name, url, description; no ratings, pricing, reviews, or other unverified claims).
- **Consolidated the pre-existing concept-preview `noindex` logic** (previously a separate ad-hoc effect in `SiteLayout.tsx`) into `DocumentHead`, so there is exactly one piece of code that ever writes a `robots` meta tag — eliminating a latent risk of two effects racing to own the same tag.
- **Static-tag/dynamic-tag handoff**: the static tags baked into `index.html` (description, robots, canonical — needed as the very first paint and as a no-JS fallback for the bare `/` and `/insight` compatibility routes) now carry a shared `data-seo-managed="true"` marker. `DocumentHead` clears every tag carrying that marker before writing its own, so there is never a duplicate/conflicting pair of tags once React mounts — verified explicitly (see below), since this was found to be broken on the first implementation pass.
- **`robots.txt` and `sitemap.xml` generation** (`scripts/generate-seo-files.mjs`, wired into `npm run build`): `robots.txt` allows all crawlers by default, explicitly allows `OAI-SearchBot` and `GPTBot` per the confirmed decision, disallows `/api/` and concept-preview query URLs (`/*?concept=`), and references the sitemap. `sitemap.xml` lists exactly the four indexable URLs (`/he`, `/en`, `/he/insight`, `/en/insight`) with bidirectional `hreflang` alternates — no private result pages, no internal documentation, no query-string URLs.
- **Build-time pre-rendering** (`scripts/prerender.mjs`, wired into `npm run build` after `vite build`): spins up `vite preview` against the real build output, drives the local headless Edge browser (via CDP, the same pattern used for every browser-verification script since Phase 7) to each of the four indexable routes, waits for full render, and writes the resulting `document.documentElement.outerHTML` to `dist/he/index.html`, `dist/en/index.html`, `dist/he/insight/index.html`, and `dist/en/insight/index.html`. Real users still get the same bundled JS/CSS (the captured HTML includes the actual built `<script type="module">`/`<link rel="stylesheet">` tags) and the app hydrates normally — a standard "static snapshot + hydrate" pattern, resolving the master plan's "main content must not depend on crawlers executing complex client-side JavaScript" requirement without any new dependency.
- **Root shell (`index.html`) stays `noindex,follow`** with a canonical link to `/he` — it only serves the bare `/` and `/insight` compatibility-redirect routes (existing Phase 3 behavior, untouched) and is never linked to internally or listed in the sitemap. A real server-side (HTTP-level) redirect for the bare domain root is explicitly left to Phase 16 (hosting/deployment configuration), not built here.

## Bugs found and fixed during this phase

1. **Self-inflicted prerender corruption via `<meta http-equiv="refresh">`**: the first implementation added an unconditional meta-refresh (`content="0;url=/he"`) to the root shell as a no-JS crawler fallback. Because `vite preview`'s SPA fallback serves that exact shell for `/he`, `/en`, etc. *before* their real prerendered files exist (a chicken-and-egg problem unique to the prerendering process itself), the meta-refresh fired mid-navigation during prerendering, causing every route's capture to be an empty, unrendered shell. Fixed by removing the meta-refresh entirely — the canonical link plus `noindex,follow` is a sufficient, non-self-interfering signal for the shell's narrow purpose, and a real HTTP redirect for the bare domain root correctly belongs to Phase 16's hosting configuration, not a client-side/meta tag here.
2. **Duplicate/conflicting `robots`, `canonical`, and `description` tags**: the static tags baked into `index.html`'s `<head>` (needed for first paint and the no-JS root-shell case) were never removed once `DocumentHead` added its own dynamic versions, so every rendered page briefly (and, in the prerendered snapshot, *permanently*) carried two `robots` meta tags (one `noindex,follow` from the static template, one `index,follow` from `DocumentHead`) and two canonical links — a real risk, since crawlers that encounter conflicting `robots` directives commonly treat them as a union of restrictions, which could have caused every real page to be silently excluded from indexing. Fixed by tagging the static versions with the same `data-seo-managed="true"` marker `DocumentHead` already uses for its own tags, so they are cleanly removed on mount. Verified via `grep -o` against the prerendered files: exactly one of each tag remains.
3. **Wrong page title on non-home pages**: `src/i18n/language.tsx`'s `LanguageProvider` had its own pre-existing `document.title = ...` effect (setting only the generic site title, from before this phase), and since `LanguageProvider` sits above `SiteLayout` in the provider tree, its effect fired *after* `DocumentHead`'s and overwrote the correct per-page title with the generic one — every prerendered page showed the home page's title regardless of route. Fixed by removing that now-redundant responsibility from `LanguageProvider`; `DocumentHead` is the sole owner of `document.title` going forward. Verified: `/he/insight` and `/en/insight` now correctly show "HUMA Organizational Insight | HUMA Labs" instead of the generic site title.
4. **Verification-script false negative (not an app bug)**: an initial no-JS crawler-simulation check fetched routes against `vite preview`, which returned the small root-shell body for every route (2174 bytes) because `vite preview`'s SPA-fallback middleware intercepts all extension-less paths before checking for an exact static-file match — masking the real prerendered files. Fixed by switching the verification server to a minimal, dumb static-file server (exact-match-or-404, no SPA rewrite) that correctly mirrors how a standard static host serves this `dist/` output.

## Verification performed

### Automated validation — `npm run validate:seo` (`scripts/validate-phase12.mjs`)

18 checks, all passing, covering: page-registry completeness, the `OAI-SearchBot`/`GPTBot`-allow scope-decision regression guard, the placeholder-domain regression guard, `index.html`'s root-shell `noindex` and baseUrl-sync guard, `robots.txt` content (default allow, `/api/` disallow, concept-query disallow, both AI-crawler directives, sitemap reference), `sitemap.xml` content (exactly the 4 expected URLs, no query/private URLs, xhtml namespace present), localized SEO-metadata completeness, a canonical/hreflang logic simulation (mirroring `DocumentHead.tsx`'s pure logic in plain JS per this repo's established convention), and a structured-data field allowlist check (only `@context`/`@type`/`@graph`/`name`/`url`/`description`/`inLanguage` — no fabricated claims). Full report: `docs/implementation/validation/phase-12/phase12-validation-report.json`.

### Production-like, no-JS browser verification — `docs/implementation/validation/phase-12/phase12-prerender-check.mjs`

This is the master plan's required "production-like HTML verification": a plain HTTP client (Node's `fetch`, which never executes `<script>` tags — a direct simulation of a non-JS-executing crawler) fetching each of the four indexable routes against a dumb static-file server serving the real `npm run build` output.

| Route | Status | Body size | Title correct | Visible text present | `robots` | Canonical | `hreflang` (incl. x-default) | Structured data |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/he` | 200 | 23,141 bytes | ✓ | ✓ | exactly 1, `index,follow` | exactly 1 | 3 alternates, x-default present | ✓ present |
| `/en` | 200 | 24,850 bytes | ✓ | ✓ | exactly 1, `index,follow` | exactly 1 | 3 alternates, x-default present | ✓ present |
| `/he/insight` | 200 | 9,722 bytes | ✓ | ✓ | exactly 1, `index,follow` | exactly 1 | 3 alternates, x-default present | ✓ absent (correct — home only) |
| `/en/insight` | 200 | 10,142 bytes | ✓ | ✓ | exactly 1, `index,follow` | exactly 1 | 3 alternates, x-default present | ✓ absent (correct — home only) |

`robots.txt` and `sitemap.xml` were also fetched over real HTTP: both return 200; `robots.txt` explicitly allows `OAI-SearchBot` and `GPTBot`; `sitemap.xml` contains exactly 4 `<loc>` entries. Full report: `docs/implementation/validation/phase-12/phase12-prerender-check.json`.

### Concept-preview regression check

A dedicated browser check confirmed the pre-existing "do not index concept-preview URLs" guardrail still works correctly after consolidating its logic into `DocumentHead`: `/he` → `robots: index,follow`; `/he?concept=c` → `robots: noindex,nofollow`, with exactly one `robots` meta tag present in both cases (no duplication).

### Standard checks

- `npm.cmd run build` (now: generate SEO files → `tsc -b` → `vite build` → prerender) -> Pass
- `npm.cmd run validate:content` -> Pass
- `npm.cmd run validate:language` -> Pass
- `npm.cmd run validate:quiz` -> Pass
- `npm.cmd run validate:llm` -> Pass
- `npm.cmd run validate:email` -> Pass
- `npm.cmd run validate:analytics` -> Pass
- `npm.cmd run validate:seo` -> Pass (new)

## Files created

- `config/seo.json`, `config/seo-pages.json`
- `src/seo/seo-config.ts`, `src/seo/DocumentHead.tsx`
- `scripts/generate-seo-files.mjs`, `scripts/prerender.mjs`, `scripts/validate-phase12.mjs`
- `docs/implementation/validation/phase-12/phase12-prerender-check.mjs` / `.json`
- `docs/implementation/validation/phase-12/phase12-validation-report.json`
- `docs/implementation/validation/phase-12/phase12-seo-report.md` (this file)
- `public/robots.txt`, `public/sitemap.xml` (generated by `scripts/generate-seo-files.mjs`; regenerated on every build)

## Files changed

- `index.html` (static-tag `data-seo-managed` markers; removed the self-interfering meta-refresh)
- `src/components/SiteLayout.tsx` (removed the ad-hoc concept-preview `noindex` effect; renders `<DocumentHead />`)
- `src/i18n/language.tsx` (removed the now-redundant `document.title` assignment and the `getRouteTitle` helper)
- `messages/he/seo.json`, `messages/en/seo.json` (extended with per-page title/description)
- `package.json` (`build` script now chains SEO-file generation and prerendering; added `validate:seo` and `seo:generate`)
- `docs/implementation/huma-website-master-plan.md`

## Known deviations / deferred items

- The final production domain remains an open decision (§23); `https://www.huma-labs.example` is used everywhere a base URL is needed and must be swapped at deployment time — `config/seo.json`'s `baseUrl` and the matching value hardcoded in `index.html`'s static canonical link are the only two places this needs to change.
- No Open Graph/social image was added — "social images" is an explicit open decision (§23) and no real, approved image asset exists yet; fabricating one risked shipping unapproved branding. `og:image`/`twitter:image` are simply omitted rather than pointing at a placeholder or broken path.
- The crawlable-rendering approach only pre-renders the two indexable routes named in `config/seo-pages.json` (home, insight-intro); the private, dynamically-generated insight *result* is never pre-rendered or indexed, matching the master plan's explicit "do not index private result pages" rule.
- A real server-side (HTTP-level) redirect for the bare `/` and `/insight` compatibility routes is intentionally left to Phase 16 (hosting/deployment) — this phase only ensures the interim client-redirect shell is `noindex` and points a canonical hint at the real content.
- Search Console ownership, SEO monitoring frequency, approved keyword targets, and public organization/About/knowledge-section content all remain open decisions (§23) outside this phase's engineering scope.

## Exit-criteria result

- Crawlable rendering strategy is implemented (build-time pre-rendering) and verified via a genuine non-JS-executing HTTP fetch against production-like static output.
- Canonical rules, `hreflang` (bidirectional + x-default), and localized metadata are implemented and verified for every indexable page in both languages.
- `robots.txt` and `sitemap.xml` are implemented, valid, and verified — including the explicit `OAI-SearchBot`/`GPTBot` allow decision.
- Structured data is present only on the home page and contains only already-approved, already-visible facts — no fabricated claims.
- Concept-preview URLs (`?concept=c`) remain `noindex,nofollow` and are excluded from the sitemap and from `robots.txt`'s crawlable set.
- No private/dynamic result content is indexed or included in the sitemap.
- No Phase 13 or later work was started. No Git modification was performed. No deployment was performed.

Recommended Phase 12 status: `READY FOR REVIEW`
