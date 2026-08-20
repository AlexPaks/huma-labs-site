# Concept A Design System

Date: 2026-08-17
Phase: Phase 4 - Concept A Implementation
Authority:

- `docs/design-concepts/images/concept-a-hero-desktop-v2.png`
- `docs/design-concepts/images/concept-a-hero-mobile-v2.png`
- `docs/design-concepts/images/concept-a-problem-insight-desktop.png`
- `docs/design-concepts/images/concept-a-insight-desktop.png`
- `docs/design-concepts/images/concept-a-insight-flow-desktop.png`
- `docs/design-concepts/images/concept-a-insight-mobile.png`
- `docs/design-concepts/images/concept-a-insight-result-desktop.png`
- `docs/design-concepts/images/concept-a-capabilities-method-desktop.png`
- `docs/design-concepts/images/concept-a-challenges-formats-desktop.png`
- `docs/design-concepts/images/concept-a-outcomes-contact-desktop.png`
- `docs/design-concepts/README.md`
- `docs/content/terminology.md`

## 1. Design intent

Concept A is editorial, typographic, spacious, and authoritative.
Typography is the primary visual system.
The copper thread is a structural connector rather than decoration.
The page uses open composition, rules, numbering, and disciplined whitespace instead of cards.

## 2. Implemented token source map

| Token area | Planned implementation source | Reference evidence |
| --- | --- | --- |
| Background | `src/styles.css` CSS variables | Off-white page field across all Concept A references |
| Primary text | `src/styles.css` CSS variables | Large editorial headings in hero, insight, capabilities, outcomes |
| Secondary text | `src/styles.css` CSS variables | Supporting copy in hero, problem framing, contact |
| Copper accent | `src/styles.css` CSS variables | Thread, rules, numbering, CTA borders, progress, form accents |
| Border/rule color | `src/styles.css` CSS variables | Hairline dividers in insight, challenges, outcomes, form fields |
| Editorial font | `src/styles.css` font stack | High-contrast serif heading treatment in all Concept A references |
| UI/body font | `src/styles.css` font stack | Clean restrained body and control typography in all Concept A references |

## 3. Palette

Approved palette:

- Background: `#FAFAF7`
- Primary text: `#1A1A1A`
- Secondary text: `#4A4A4A`
- Copper accent: `#C25E3E`
- Border: `#EAEAE4`

Additional implementation support values:

- Muted border: `#D8D3CA`
- Soft line shadow for copper thread only where needed for legibility: transparent brown alpha, never heavy shadow
- Surface white: `#FDFCFA`

Decision:

- Keep the approved off-white background.
- Do not shift the color temperature toward pure gray or pure white.
- Do not introduce gradients, glows, extra accent colors, or dark-mode variants.

## 4. Typography

Implementation direction:

- Editorial display: high-contrast serif stack in CSS
- UI and body: `Assistant`, already present in the project

Planned CSS font families:

- `--font-ui: "Assistant", sans-serif`
- `--font-editorial: "Times New Roman", "Noto Serif Hebrew", Georgia, serif`

Reasoning:

- `Assistant` is already loaded and supports Hebrew and English cleanly for UI, body, labels, and forms.
- The editorial serif stack creates the mature, document-like tone needed for headings and brand moments without adding a new external dependency during Phase 4.

Typography scale:

- Hero H1 desktop: approx `clamp(4rem, 7vw, 7.5rem)`
- Hero H1 mobile: approx `clamp(3.15rem, 13vw, 4.6rem)`
- Section display heading: approx `clamp(2.8rem, 4.8vw, 5.25rem)`
- Insight question heading: approx `clamp(2.5rem, 5vw, 4.8rem)`
- Capability names/process labels: `clamp(2.2rem, 3.5vw, 4rem)`
- Body lead: `1.2rem` to `1.45rem`
- Body copy: `1rem` to `1.15rem`
- Navigation/control text: `0.95rem` to `1rem`
- Small labels, numbers, progress markers: `0.95rem` with letter spacing when English or numeric

Typography behavior:

- Hebrew headings keep low letter spacing and generous line height control.
- English editorial labels may use wider tracking where the reference shows it.
- Buttons and inputs must receive deliberate font sizing and weight, never browser defaults.

## 5. Spacing system

Section rhythm:

- Desktop outer sections: `6rem` to `8rem` vertical spacing
- Mobile outer sections: `3.5rem` to `4.5rem`
- Internal stacks: `1rem`, `1.5rem`, `2rem`, `3rem`
- Rule-separated rows use generous vertical padding rather than boxed cards

Container model:

- Primary max width: approx `1520px`
- Readable text measures: `38ch` to `54ch`
- Open gutters with logical inline padding
- No generic centered narrow marketing column through the entire page

Grid approach:

- Hero: asymmetrical desktop split with large heading field and narrow ledger field
- Problem/Insight: diagnostic split with structural line connection
- Capabilities/Method: open top row plus process rail
- Challenges/Formats: editorial split with list and formats matrix
- Outcomes/Contact: ruled top outcomes band, then split form and consultative CTA

## 6. Borders and rules

- Rules are thin and quiet
- Border thickness: `1px`
- Dividers use `#EAEAE4` or a close muted variant
- No thick frames around every section
- Use long horizontal rules to organize space before using containers

## 7. Buttons

Primary CTA:

- Rectangular, restrained, hairline copper border
- Off-white fill or transparent background with copper text
- Large internal padding
- No pills, no rounded full badges

Secondary action:

- Text link or low-friction underlined action
- Used in hero, insight, and back/continue controls

Interaction:

- Hover and focus rely on contrast and slight background/border change
- No jumpy motion
- Visible focus ring must remain stronger than the decorative thread

## 8. Form controls

- Controls stay code-native and accessible
- Large text input surfaces with understated borders
- Labels sit outside the fields
- Multi-select options should feel like editorial selectors, not SaaS chips
- Submit button follows the same CTA system
- Error and success states must be legible in both Hebrew and English

## 9. Navigation

Desktop Hebrew:

- Brand at inline start of RTL flow
- Navigation and language switch in the opposite cluster
- One calm row, no hamburger

Desktop English:

- Equivalent hierarchy in coherent LTR layout
- Same anatomy, not a mirrored gimmick

Mobile:

- One logo and one menu button
- Language switch and nav items move into the expanded panel
- Menu requires keyboard support, Escape close, and focus return

## 10. Copper line

Implementation method:

- CSS and inline SVG only
- Decorative only
- `pointer-events: none`
- `aria-hidden="true"`

Behavior:

- Flat
- Thin
- Restrained
- Behind content
- Section-specific path logic
- No texture, rope, concrete, raster image, 3D shading, or strong shadow

Roles by section:

- Hero: connects organizational change ledger to the main promise
- Problem/Insight: bridges challenge framing to Organizational Insight entry
- Insight flow: supports progress and directional movement
- Capabilities/Method: ties the four capabilities to `Discover / Design / Act`
- Challenges/Formats: acts as divider and pivot point
- Outcomes/Contact: quietly divides outcomes from the consultative form area

## 11. Responsive behavior

- Mobile is a real adaptation, not a compressed desktop
- First viewport must prioritize headline, body copy, one dominant CTA, and the vertical copper guide
- Thread paths simplify on small screens
- Dense rule systems collapse to single-column stacks with preserved order
- No horizontal overflow

## 12. Motion behavior

- Minimal motion only
- Allowed:
  - section reveal
  - selected answer state
  - progress movement
  - menu open/close
- Respect `prefers-reduced-motion`
- No parallax, no continuous thread animation, no decorative looping motion

## 13. Focus states

- High-contrast visible focus ring
- Must remain distinct from copper decorative lines
- Links, buttons, form fields, and answer selectors all require keyboard-visible focus

## 14. Component ownership plan

Planned Phase 4 ownership in `src/concepts/concept-a/`:

- `components`
  - brand
  - header
  - footer
  - thread helpers
  - editorial section heading
- `sections`
  - home hero
  - problem and insight entry
  - capabilities and method
  - challenges and formats
  - outcomes and contact
  - insight overview
  - insight active state
  - insight result

Shared layers remain the authority for:

- localized messages
- route logic
- dynamic form definitions
- form validation
- assessment definition
- language switching logic

## 15. Known implementation constraints

- Concept PNG copy is not authoritative.
- Official visible copy must come from localized messages and approved content files.
- Missing proof content must be omitted, not invented.
- Phase 4 may implement presentational interaction for the Insight flow, but not Phase 7 branching, scoring, or server-backed behavior.
