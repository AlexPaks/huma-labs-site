# Phase 15.6 - Brevo Transactional Email Integration

Date: 2026-08-23
Status: READY FOR REVIEW

## Decision and scope

The user selected Brevo for HUMA transactional email delivery and requested that the completed integration be formalized as Phase 15.6. This phase adds a direct server-side Brevo provider for email only. SMS, marketing campaigns, contact synchronization, deployment, and production activation are outside Phase 15.6.

## Implementation

- Added `server/email/providers/brevo-email-provider.mjs`.
- Registered `EMAIL_PROVIDER=brevo` in the existing provider-neutral email service.
- Reused the existing contact and Organizational Insight delivery endpoints and templates.
- Added timeout handling, safe provider errors, reply-to support, and Brevo sandbox support.
- Preserved the mock and generic SMTP providers.
- Added `server:dev:env`, `validate:brevo-email`, and `validate:phase15-6` scripts.
- Added empty, safe Brevo variables to `.env.example`; runtime credentials remain in gitignored `.env.local` only.

## Security correction

During Phase 16 readiness inspection, real OpenAI and Brevo credentials were discovered in the working-tree version of `.env.example`. They were immediately migrated to `.env.local`, and `.env.example` was restored to empty mock-first defaults. A read-only Git audit found no secret values in `HEAD` or repository history.

Because the credentials appeared in command output, both keys must still be revoked and replaced before any real provider validation or Phase 16 deployment. No external call was made with the exposed credentials.

## Verification

- `npm run validate:phase15-6`: passed, five no-network checks.
- `npm run validate:email`: passed, all existing Phase 10 email regressions.
- `npm run build`: passed.
- Missing credentials fail before network access.
- Sandbox and live-mode request construction are verified through injected test transport only.
- Existing contact and Insight templates render through the Brevo provider contract.
- Provider rejection is classified without exposing credentials or raw provider content.
- Network requests sent during Phase 15.6 validation: `0`.
- Real emails sent during Phase 15.6 validation: `0`.

Evidence: `docs/implementation/validation/phase-15.6/phase15-6-validation-report.json`.

## Required activation configuration

The following variables must be configured server-side with rotated credentials:

```env
EMAIL_PROVIDER=brevo
BREVO_API_KEY=
BREVO_FROM_EMAIL=
BREVO_FROM_NAME=HUMA Labs
BREVO_SANDBOX=true
CONTACT_NOTIFICATION_EMAIL=
```

`BREVO_FROM_EMAIL` must be a verified Brevo sender. Production delivery requires an explicit decision to set `BREVO_SANDBOX=false`.

## Exit criteria

- Brevo provider implementation is complete and regression-tested.
- Existing site forms and provider alternatives are preserved.
- No secret is stored in a tracked environment template.
- No Git commit, push, Vercel link, external provider call, or deployment was performed in this phase.
- Phase 16 remains `NOT STARTED`.

Recommended Phase 15.6 status: `READY FOR REVIEW`
