# Phase 2 Content Inventory

Date: 2026-08-17

Purpose:

- Record the complete pre-migration user-visible content inventory that was extracted from the Phase 1 application source before copy migration.
- Confirm the new authoritative Phase 2 ownership for every visible copy group.

## Original pre-migration source files

- `src/content/siteContent.ts`
- `src/pages/HomePage.tsx`
- `src/pages/InsightPage.tsx`
- `src/components/ContactForm.tsx`
- `src/components/SiteLayout.tsx`
- `src/shared/components/AppErrorBoundary.tsx`

## Extracted content inventory by category

### Navigation, brand, and footer

- Authoritative Hebrew message paths:
  - `messages/he/navigation.json`
  - `messages/he/common.json`
- Extracted groups:
  - primary navigation labels
  - navigation aria label
  - brand name
  - brand tagline
  - footer English copyright line
  - footer Hebrew tagline

### Home page

- Authoritative Hebrew message path:
  - `messages/he/homepage.json`
- Extracted groups:
  - hero eyebrow
  - hero headline lines
  - hero body
  - hero English subtitle
  - hero CTA labels
  - hero panel eyebrow, title, and body
  - context section eyebrow, title, and paragraphs
  - Organizational Insight preview eyebrow, title, body, CTA
  - capabilities section eyebrow, title, body
  - capability labels, titles, and descriptions
  - process section eyebrow, title, body
  - Discover / Design / Act labels, titles, descriptions, outcomes
  - challenge section eyebrow, title, body, direction label
  - challenge statements and development directions
  - formats section eyebrow and title
  - delivery format labels
  - outcomes section eyebrow and title
  - outcome labels and titles
  - contact section eyebrow, title, and body

### Organizational Insight page and quiz content

- Authoritative Hebrew message path:
  - `messages/he/assessment.json`
- Extracted groups:
  - insight page hero eyebrow, title, body, subtitle
  - insight page hero diagnostic panel eyebrow, title, body
  - question-journey eyebrow, title, body
  - homepage preview labels for all six questions
  - all six quiz questions
  - all quiz helper texts
  - all option labels for questions 1-5
  - open-prompt label for question 6

### Insight result content

- Authoritative Hebrew message path:
  - `messages/he/insight-result.json`
- Extracted groups:
  - result primary-card eyebrow
  - primary capability label
  - focus title
  - three focus bullets
  - HUMA direction title
  - insight follow-up contact eyebrow and title

### Dynamic form content

- Authoritative Hebrew message path:
  - `messages/he/contact-form.json`
- Extracted groups:
  - contact form submit label and description
  - insight-email form submit label and description
  - field labels for full name, role, organization, work email
  - focus-area legend and option labels
  - challenge textarea label

### Validation and system copy

- Authoritative Hebrew message paths:
  - `messages/he/validation.json`
  - `messages/he/system.json`
- Extracted groups:
  - required, email, min-length, max-length, invalid-option, consent validation messages
  - error-boundary brand, title, and body
  - local-only form state message

### Reserved Phase 2 message domains created for future phases

- `messages/he/cookie-consent.json`
- `messages/he/privacy.json`
- `messages/he/seo.json`
- `messages/en/*.json`

Status:

- `messages/en/` currently mirrors the full Hebrew key tree for parity validation only.
- English values are intentionally not finalized in Phase 2 and are not rendered in the UI.

## Structural owners created in Phase 2

- Site-wide content schema:
  - `content/site-structure.json`
- Quiz definition:
  - `content/assessment.json`
- Public form definitions:
  - `forms/contact-form.json`
  - `forms/insight-email-form.json`

## Inventory result

- All current visible homepage, insight-page, form, footer, and system copy groups were extracted from React and TypeScript source into localized message files and schema references.
- No user-visible HUMA copy remains intentionally hardcoded in application source after migration.
