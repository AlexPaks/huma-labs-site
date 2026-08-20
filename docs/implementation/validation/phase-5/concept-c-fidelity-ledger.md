# Concept C Fidelity Ledger

Date: 2026-08-18 (revised same day after a user-reported fidelity gap)  
Phase: Phase 5 - Concept C Implementation  
Status: Implementation completed in workspace and documented for review; Phase 5 approval is still pending user review.

## Revision note

- The user reviewed the first implementation pass against the approved Concept C reference images and reported that the site did not resemble them.
- On direct pixel comparison, three sections were confirmed to be missing the illustrative/diagram treatment that is core to Concept C's identity: the Home hero (no isometric illustration), the Problem/Insight context area (no coiled-thread graphic, numbered vertical list instead of divided captions), and the Capabilities/Method area (plain text table instead of a connected flow diagram).
- All three were reworked as real semantic HTML/SVG components (no raster images, per master-plan rule) and re-verified against the reference images and in the browser before this revision. See "Rework summary" below.

## Browser path

- Browser plugin availability: `not available in this session`
- Verification fallback: `local Microsoft Edge headless via CDP`
- Active preview base URL during capture: `http://localhost:4175` (local `vite preview` build), reusing the same `phase5-concept-c-check.cjs` script
- Port note: earlier captures in this phase used `4174`; this revision's captures used `4175` because a different local port was free at capture time. Base URL is recorded per capture set and does not affect the served content.

## Authority references

- `docs/design-concepts/images/concept-c-hero-desktop.png`
- `docs/design-concepts/images/concept-c-hero-mobile.png`
- `docs/design-concepts/images/concept-c-problem-insight-desktop.png`
- `docs/design-concepts/images/concept-c-insight-flow-desktop.png`
- `docs/design-concepts/images/concept-c-insight-result-desktop.png`
- `docs/design-concepts/images/concept-c-capabilities-method-desktop.png`
- `docs/design-concepts/images/concept-c-challenges-formats-desktop.png`
- `docs/design-concepts/images/concept-c-outcomes-contact-desktop.png`

## Shared-foundation checks

- `npm.cmd run build` -> Pass
- `npm.cmd run validate:content` -> Pass
- `npm.cmd run validate:language` -> Pass
- Localized routes preserved:
  - `/he?concept=c`
  - `/en?concept=c`
  - `/he/insight?concept=c`
  - `/en/insight?concept=c`
- Query-based Concept C preview preserved localized routing instead of creating a new canonical route.
- The preview path adds a `noindex,nofollow` robots meta only when `concept=c` is active.
- Shared content, message catalogs, forms, and assessment definition remained authoritative.

## Render evidence

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
- `docs/implementation/validation/phase-5/phase5-concept-c-check.json`

## Core browser checks

Result source: `docs/implementation/validation/phase-5/phase5-concept-c-check.json`

| Check | Result | Evidence |
| --- | --- | --- |
| Page identity | Pass | Local app loaded from `http://localhost:4175` during this revision's capture pass |
| Not blank | Pass | Final `textLength` values remained positive in all captured states |
| Framework overlay | Pass | `hasViteOverlay: false` in the saved JSON evidence |
| Duplicate IDs | Pass | `duplicateIds: []` in the saved JSON evidence |
| Horizontal overflow | Pass | `horizontalOverflow: false` in the saved JSON evidence |
| Console health | Pass | `consoleMessages: []` in the saved JSON evidence |
| Localized Insight flow | Pass | Hebrew and English Intro, Question, and Result captures were saved under `docs/implementation/validation/phase-5/` |

## Rework summary

- **Home hero**: replaced the previous minimal thread-and-plinth composition with a real SVG isometric illustration (`ConceptCHeroArt.tsx`) — a staircase of isometric blocks with a copper thread winding through them into a terracotta accent cube, matching the visual grammar of `concept-c-hero-desktop.png` far more closely than the prior build.
- **Problem/Insight context**: added a real SVG coiled-thread graphic (`ConceptCCoiledThread.tsx`) matching the reference's decorative wire loop, and reflowed the three/four change-item captions from a numbered vertical list into a divided horizontal column row (bold caption per column, separated by dividers), closer to the reference's layout. The insight-entry block below was also destyled from a bordered card into a plain full-width block matching the reference's flatter treatment, separated by a top divider.
- **Capabilities/Method**: added a real connected diagram — two vertical spine lines between the three columns, horizontal connector ticks from each capability and outcome item into the spines, and the Discover/Design/Act steps reflowed into a horizontal row with node dots and direction-aware chevron connectors (verified separately in Hebrew RTL and English LTR after an initial chevron-direction bug was caught and fixed).
- All three reworked components were rebuilt, re-validated (`build`, `validate:content`, `validate:language` all passing), and re-captured through the full Phase 5 evidence script (`phase5-concept-c-check.cjs`) before this ledger revision.

## Evidence that Concept C is not Concept A with different colors

This implementation is structurally distinct from Concept A in the following ways:

- The shell uses a dedicated Concept C header and footer instead of the Concept A chrome.
- The Home hero uses an isometric architectural illustration with a winding copper thread, rather than the Concept A editorial ledger plus lateral thread composition.
- Problem framing and `Organizational Insight` are recomposed into one integrated Concept C transition section, including a coiled-thread illustration, instead of the Concept A paired editorial split.
- The capabilities and method area is rendered as a genuine connected diagram — capabilities and outcomes linked to the method column by spine lines and connector ticks, with the Discover/Design/Act steps joined by node dots and direction-aware arrows.
- The Insight Intro uses a list-and-statement composition with larger open field spacing instead of the Concept A thread-ledger intro split.
- The Insight Question state uses a dedicated Concept C progress rail and side journey structure instead of the Concept A centered prompt layout.
- The Insight Result state uses a broad typographic result field with a different action/contact arrangement from Concept A.

## Fidelity review summary

### Strong matches

- The Home hero now carries a real isometric illustration with a winding copper thread and accent cube, reading as an illustrated composition rather than plain typography — the primary gap the user flagged is closed.
- The Problem/Insight context area now carries a real coiled-thread illustration and a divided-column caption row instead of a numbered list.
- The Capabilities/Method area now reads as a genuine connected diagram with spine lines, connector ticks, and direction-aware flow arrows between Discover/Design/Act, instead of a plain text table.
- The desktop Intro experience reads as calm, spacious, typographic, and decision-maker oriented.
- The desktop Question and Result states are not card-heavy or generic SaaS panels.
- The preview mechanism stayed hidden from normal production navigation and required `?concept=c`.
- The copper accent behaves as a restrained structural system rather than as glowing AI decoration.
- Both the Hebrew (RTL) and English (LTR) renders of the new Capabilities/Method flow arrows were checked individually; an initial direction bug (arrows pointing down instead of left in Hebrew) was caught and fixed before this ledger was finalized.

### Known deviations

- The hero illustration is a simplified isometric block composition (SVG polygons), not a fully rendered material/lighting illustration like the generated reference image.
- The coiled-thread graphic in the Problem/Insight section is smaller and simpler than the reference's more elaborate figure-eight coil.
- The Problem/Insight change-item captions are single bold statements (reusing existing sentence-fragment content) rather than the reference's separate bold-header-plus-description pairing, since the underlying content model does not currently carry that split; no new copy was invented to avoid diverging from the approved content authority.
- The Capabilities/Method connector lines are a simplified spine-and-tick system rather than the reference's per-item curved Sankey-style connectors, since exact per-item convergence would require JS-measured layout rather than static CSS/SVG.
- Some Home and section labels remain more restrained and text-led than the more illustrated Concept C reference images.
- The full-page Home captures remain taller and more document-like than the compressed design images because they capture the implemented page, not a montage artifact.
- The Intro and mobile captures still include more open whitespace than the generated concept images, especially below fold.

## Post-capture note

- A small post-capture adjustment was applied to the Concept C hero thread labels so they derive from approved content rather than a weaker generic label; this remains true of the current build.
- The three fidelity gaps described above (hero illustration, coiled thread, capabilities/method diagram) were identified by the user after reviewing this ledger against the reference images, then corrected in the same session: new SVG art components were added, the affected CSS and section components were reworked, and the full Phase 5 evidence set (`phase5-concept-c-check.cjs`) was re-run successfully against the corrected build.
- `npm.cmd run build`, `npm.cmd run validate:content`, and `npm.cmd run validate:language` all passed against the corrected build, and this revision's screenshots reflect that corrected build (no pending recapture gap remains).
