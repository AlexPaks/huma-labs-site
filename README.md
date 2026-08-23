# HUMA Labs Website

A bilingual (Hebrew/English) website for HUMA Labs, built through a phase-gated implementation plan. It presents two parallel visual concepts (Concept A and Concept C) on top of shared content, messages, and application logic, and includes a dynamic organizational-assessment Quiz, secure server-side LLM-backed insight generation, secure email delivery, consent-gated marketing analytics, and SEO/crawlability infrastructure.

## Status

Implementation is complete through **Phase 15.6 (Brevo Transactional Email Integration)** and is ready for review. The current default is **Concept D**; Concept A and Concept C remain available as retained preview implementations.

Phase 15.6 review/commit and Vercel deployment (Phase 16) remain before the site is live. Phase 16 is not started and has documented readiness blockers.

The authoritative record of every phase's scope, implementation, and verification evidence is `docs/implementation/huma-website-master-plan.md`. Per-phase reports and browser-verification evidence live under `docs/implementation/validation/phase-*/`.

## Getting started

```bash
npm install
npm run dev          # Vite dev server
npm run server:dev    # local API dev server (server/devServer.mjs), separate terminal
```

By default, LLM analysis and email sending use safe mock providers that make no network calls and require no credentials. See `.env.example` for the environment variables that switch to real providers (never commit a populated `.env`/`.env.local`).

Brevo transactional email is available through `EMAIL_PROVIDER=brevo`. Configure the gitignored `.env.local` with `BREVO_API_KEY`, a verified `BREVO_FROM_EMAIL`, `BREVO_FROM_NAME`, `BREVO_SANDBOX=true`, and `CONTACT_NOTIFICATION_EMAIL`, then start the API with `npm run server:dev:env`. Keep sandbox enabled until request validation passes; changing it to `false` enables real delivery.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Generate SEO files, type-check, build, and pre-render the production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run server:dev` | Start the local API dev server (contact, insight delivery, insight analysis) |
| `npm run server:dev:env` | Start the local API dev server with `.env.local` |
| `npm run validate:content` | Validate content schemas and message coverage |
| `npm run validate:language` | Validate bilingual/RTL-LTR behavior |
| `npm run validate:quiz` | Validate the dynamic assessment engine |
| `npm run validate:llm` | Validate the secure LLM integration |
| `npm run validate:email` | Validate the secure email integration |
| `npm run validate:brevo-email` | Validate the Brevo provider without network calls or real delivery |
| `npm run validate:phase15-6` | Validate the formal Phase 15.6 Brevo integration evidence |
| `npm run validate:phase16-readiness` | Audit Vercel readiness without linking or deploying |
| `npm run validate:analytics` | Validate marketing analytics and consent |
| `npm run validate:seo` | Validate SEO/crawlability output |
| `npm run validate:qa` | Validate the Phase 13 accessibility/QA regression guards |
| `npm run validate:concept-decision` | Validate the Phase 14 final-concept decision stays recorded |
| `npm run seo:generate` | Regenerate `public/robots.txt` and `public/sitemap.xml` from `config/seo.json` |

## Project structure

- `src/` — application source (concepts, pages, shared components, analytics, SEO, i18n)
- `server/`, `api/` — local dev server and Vercel-adapter serverless functions sharing one framework-agnostic core handler per endpoint
- `messages/`, `content/`, `forms/`, `config/` — externalized copy, structured content, dynamic form definitions, and runtime configuration (all client-safe, no secrets)
- `scripts/` — build-time generators and phase validators
- `docs/implementation/` — the master plan and every phase's implementation report and verification evidence

## Guardrails

No real LLM provider, email provider, or marketing/tracking script is ever activated without explicit, separately-approved configuration — every provider defaults to a safe mock. See `docs/implementation/huma-website-master-plan.md` for the full guardrail list and phase-by-phase scope decisions.
