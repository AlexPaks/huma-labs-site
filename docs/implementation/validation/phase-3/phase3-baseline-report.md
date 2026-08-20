# Phase 3 Baseline Report

Date: 2026-08-17

Purpose:

- Record the pre-implementation bilingual and direction-system baseline before Phase 3 code changes.

## Incomplete English values

- `messages/en/common.json` contains empty user-facing values.
- `messages/en/navigation.json` contains empty user-facing values.
- `messages/en/homepage.json` contains empty user-facing values across hero, sections, capabilities, process, challenges, formats, outcomes, and contact.
- `messages/en/assessment.json` contains empty user-facing values across page copy, preview copy, questions, helpers, prompts, and options.
- `messages/en/insight-result.json` contains empty user-facing values.
- `messages/en/contact-form.json` contains empty user-facing values for both forms.
- `messages/en/validation.json` contains empty validation strings.
- `messages/en/system.json` contains empty system strings.
- `messages/en/seo.json` contains an empty title value.
- `messages/en/cookie-consent.json` and `messages/en/privacy.json` are structurally present but not authored.

## Hebrew-only assumptions

- `src/config/site.ts` defines `SupportedLanguage` as `he` only.
- `src/config/site.ts` sets `defaultLanguage` to `he` and disables the language switcher.
- `src/i18n/messages.ts` supports both catalogs structurally, but every call site currently relies on the default Hebrew language.
- `src/app/AppRoutes.tsx` defines only `/` and `/insight`.
- `content/site-structure.json` stores legacy unlocalized route and anchor targets such as `/`, `/insight`, and `/#contact`.
- `index.html` hardcodes `<html lang="he" dir="rtl">`.

## Hardcoded RTL assumptions

- `index.html` hardcodes RTL at the document level.
- `src/components/SiteLayout.tsx` hardcodes `text-right` for the main navigation.
- `src/pages/HomePage.tsx` hardcodes `text-right` on challenge buttons.
- No shared language-aware direction utility currently exists.

## Direction-sensitive arrows

- No hardcoded directional SVG icons or chevrons were found in the current React components.
- Direction-sensitive arrow glyphs currently appear only inside localized message content, not in JSX.

## Direction-sensitive layouts

- Header and footer layout currently assume the existing Hebrew-first experience and are not explicitly normalized for LTR.
- Navigation alignment is explicitly right-aligned.
- Challenge-choice buttons are explicitly right-aligned.
- Form fields do not currently set language-aware input direction for mixed-direction values such as email and telephone.
- The current stylesheet uses mostly neutral layout rules, but it does not yet include a shared RTL/LTR adaptation layer.

## Current route behavior

- Current homepage route: `/`
- Current insight route: `/insight`
- No localized route layer exists for `/he/`, `/he/insight/`, `/en/`, or `/en/insight/`.
- No invalid-language handling exists.
- No query-parameter language normalization exists.

## Current document language and direction

- Current document language is statically `he`.
- Current document direction is statically `rtl`.
- These values do not update at runtime.

## Current persistence behavior

- No language preference persistence currently exists.
- No language selection storage key currently exists.
- No precedence rules currently exist between URL, explicit selection, and stored preference.

## Baseline conclusion

- Phase 2 completed the message and schema extraction foundation successfully.
- Phase 3 must now add complete English authoring, a real shared language system, localized routes, switching, persistence, and document-level RTL/LTR behavior without redesigning the site.
