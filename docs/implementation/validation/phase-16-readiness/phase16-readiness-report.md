# Phase 16 - Vercel Deployment Readiness

Date: 2026-08-23
Phase status: NOT STARTED
Readiness verdict: NOT READY FOR PHASE 16 EXECUTION

## Prepared

- Vite production build command is present and currently passes.
- Vercel Node functions exist for contact, Insight delivery, and organizational analysis.
- The SPA fallback rewrite is present in `vercel.json`.
- Required OpenAI and Brevo environment-variable names are documented.
- `.env.example` is safe and contains no credential values.
- `.env.local` is gitignored and contains the local runtime configuration.
- Phase 15.6 provides dedicated no-network Brevo validation.
- An automated readiness audit is available through `npm run validate:phase16-readiness`.

## Blocking decisions and actions

1. Revoke and rotate the OpenAI and Brevo keys exposed during readiness inspection.
2. Approve the final production domain and replace `https://www.huma-labs.example` in SEO configuration.
3. Review, approve, commit, and push Phase 15.6 before Git-integrated deployment.
4. Install or invoke a pinned Vercel CLI and link the correct Vercel project during Phase 16.
5. Configure rotated secrets as sensitive Vercel variables with explicit Production and Preview scopes.
6. Decide whether Brevo production starts with sandbox enabled or real delivery enabled.
7. Create a Preview deployment and verify SPA routing, all three API functions, Hebrew/English, mobile/desktop, OpenAI, Brevo, SEO, and error logs.
8. Obtain explicit user approval before production promotion.

## Production environment inventory

| Variable | Sensitive | Required use |
| --- | --- | --- |
| `LLM_PROVIDER` | No | Set provider selection to `openai` when approved |
| `OPENAI_API_KEY` | Yes | Rotated OpenAI project key |
| `OPENAI_MODEL` | No | Approved production model identifier |
| `EMAIL_PROVIDER` | No | Set provider selection to `brevo` |
| `BREVO_API_KEY` | Yes | Rotated Brevo API key |
| `BREVO_FROM_EMAIL` | No | Verified Brevo sender address |
| `BREVO_FROM_NAME` | No | Sender display name |
| `BREVO_SANDBOX` | No | `true` for request-only validation; `false` for delivery |
| `CONTACT_NOTIFICATION_EMAIL` | Sensitive operational data | Internal recipient for contact submissions |

## Phase boundary

This readiness work does not authorize or perform Vercel linking, environment upload, Preview deployment, production deployment, domain changes, external provider calls, or Git publication. Phase 16 remains `NOT STARTED` until the blockers are resolved and the user explicitly approves execution.
