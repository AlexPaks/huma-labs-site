# Phase 8 — Secure LLM Integration Verification Report

Date: 2026-08-19
Phase: Phase 8 - Secure LLM Integration

## Scope decision confirmed with the user

The master plan's own guardrails say "Do not call OpenAI or Claude" and "Real LLM ... credentials remain prohibited until explicitly approved," while §13 recommends building the Mock Provider first. The user was asked how to reconcile this with Phase 8's deliverable list (which includes real OpenAI and Claude providers). Decision: build the full provider architecture, including real, correctly-implemented OpenAI and Claude provider code, but never call either service with real credentials in this phase. Installing the `openai` and `@anthropic-ai/sdk` packages was explicitly approved as part of this decision. `LLM_PROVIDER=mock` is the default and the only provider exercised end-to-end; the OpenAI/Claude provider code paths were verified without any network call (see "Verification without network calls" below).

## What was implemented

Directory structure (matches the master plan's planned `server/` layout in §13, adapted to plain `.mjs` files to match this repo's existing plain-Node-script convention rather than adding a TypeScript execution step):

```
server/
  api/analyze-assessment.mjs        -- core, framework-agnostic endpoint handler
  providers/
    llm-provider.mjs                -- shared interface + ProviderError
    mock-provider.mjs               -- deterministic, no network
    openai-provider.mjs             -- real OpenAI Structured Outputs implementation
    claude-provider.mjs             -- real Claude forced-tool-use implementation
  prompts/
    he/organizational-insight.md
    en/organizational-insight.md
  schemas/
    assessment-request.schema.mjs
    insight-result.schema.mjs
  services/
    assessment-normalizer.mjs
    prompt-loader.mjs
    prompt-composer.mjs
    result-validator.mjs
    rate-limiter.mjs
    prompt-injection-guard.mjs
  devServer.mjs                     -- local-only Node http server for testing
api/organizational-insight/analyze.mjs  -- thin Vercel Node function adapter (inert until Phase 16 deployment)
```

- **Endpoint**: `POST /api/organizational-insight/analyze`. `server/api/analyze-assessment.mjs` holds all real logic as a framework-agnostic `handleAnalyzeAssessment({rawBody, serializedLength, clientKey})` function; both the Vercel adapter (`api/organizational-insight/analyze.mjs`, not invoked until a real deployment) and the local dev server (`server/devServer.mjs`) call the same function, so the exact same code path was exercised in verification as would run in production.
- **Provider abstraction**: one `LlmProvider` interface (`{id, analyze(input, {timeoutMs})}`) with a shared `ProviderError` (`PROVIDER_UNAVAILABLE` | `TIMEOUT` | `INVALID_PROVIDER_OUTPUT`). The endpoint depends only on this interface — never on a specific provider.
- **Mock provider**: deterministic, in-process, no network access. Produces schema-valid structured output derived from a stable hash of the composed prompt (so different answers produce different but repeatable mock capabilities).
- **OpenAI provider**: real implementation using the `openai` package's Chat Completions API with Structured Outputs (`response_format: json_schema`, `strict: true`), reading `OPENAI_API_KEY`/`OPENAI_MODEL` from the environment. If no API key is configured, it throws `PROVIDER_UNAVAILABLE` immediately, before any network call is attempted.
- **Claude provider**: real implementation using `@anthropic-ai/sdk`, forcing structured output via a single tool (`tool_choice: {type:"tool", name:"submit_insight_result"}`) whose `input_schema` is the same JSON Schema as the OpenAI path. Same fail-safe behavior with no `ANTHROPIC_API_KEY`.
- **External prompts**: `server/prompts/{he,en}/organizational-insight.md`, each with a `promptVersion` header, HUMA terminology (Presence/Resilience/Adaptability/Leadership, Discover/Design/Act — matching `docs/content/terminology.md`), explicit analysis rules, and explicit prompt-injection safety instructions. Never bundled into the frontend or sent to the browser (they live under `server/`, which the Vite build never touches).
- **Prompt loader / composer**: `prompt-loader.mjs` reads and caches the versioned template; `prompt-composer.mjs` is the single place that assembles the final prompt (per the master-plan rule against inline string concatenation in the endpoint file itself).
- **Request validation**: `assessment-request.schema.mjs` validates the incoming body strictly against the real `content/assessment.json` — rejects unknown top-level fields, unknown question/option ids, wrong answer shape for the question type, over-length open text (2000-char limit), and oversized request bodies (20KB limit); classifies quiz-version mismatches as a distinct `UNSUPPORTED_QUIZ_VERSION` code.
- **Structured result schema**: `insight-result.schema.mjs` defines the provider-independent result (matching §15's field list) as both a JSON Schema (handed to OpenAI/Claude for constrained output) and a runtime validator (`validateInsightResultContent`) used identically regardless of which provider produced the raw output — the frontend never learns which provider was used, and arbitrary raw LLM output is never returned to the client.
- **Assessment normalization**: `assessment-normalizer.mjs` resolves each answer's option id(s) to localized label text server-side (reusing the same `messages/{lang}/assessment.json` catalogs as the frontend) and runs every open-text answer through the prompt-injection guard before it ever reaches the prompt.
- **Prompt-injection protection**: `prompt-injection-guard.mjs` is a best-effort mitigation — it neutralizes common injection patterns ("ignore previous instructions", "system:", "you are now ...", Hebrew equivalents, markdown heading/code-fence markers) in free-text answers, and the prompt itself instructs the model to treat all answer content as data, never as instructions. Documented as best-effort, not a guarantee.
- **Failure handling**: every failure mode is classified into one of `INVALID_ASSESSMENT`, `UNSUPPORTED_QUIZ_VERSION`, `RATE_LIMITED`, `PROVIDER_UNAVAILABLE`, `TIMEOUT`, `INVALID_PROVIDER_OUTPUT`, with a matching HTTP status. Raw provider errors and stack traces are never included in the response — the client only ever sees a request id and a safe, classified error code/message. One retry is attempted on a transient provider failure (not on `INVALID_PROVIDER_OUTPUT`, since retrying will not fix malformed output).
- **Rate limiting**: an in-memory sliding-window limiter (10 requests/minute per client key), verified directly. Documented as an honest match for the current single-process, non-deployed state of the project — not a distributed/production-grade limiter, which is a decision to revisit once real hosting is chosen in Phase 16.
- **Log redaction**: server logs only ever record `{quizId, quizVersion, language, answerCount}` — never the free-text answers, never provider raw errors, never API keys.
- **Request IDs**: every request/response carries a `requestId` (`crypto.randomUUID()`), independent of whether it succeeded or failed.
- **Secrets hygiene**: added `.gitignore` (previously missing from the repository entirely) covering `.env*`, `node_modules/`, `dist/`, and build artifacts, plus a safe `.env.example` documenting the expected variables. No real credentials exist anywhere in the repository.

## Verification without network calls

Per the scope decision above, neither OpenAI nor Claude was ever actually called. Verified instead:

1. **No credentials configured** → both `openaiProvider.analyze()` and `claudeProvider.analyze()` throw `ProviderError("PROVIDER_UNAVAILABLE", ...)` synchronously, before constructing any request — confirmed directly, and confirmed at the HTTP layer (`LLM_PROVIDER=openai` / `LLM_PROVIDER=claude` with no key → `503 PROVIDER_UNAVAILABLE`, no outbound request possible).
2. **Response-parsing correctness**: the pure parsing functions (`parseChatCompletionContent`, `parseToolUseInput`) were extracted from each provider and tested directly against realistic fake response objects shaped like what the real SDKs return (well-formed and malformed), proving the extraction/error-classification logic without needing the network.
3. **Structured-output schema**: the same `insightResultJsonSchema` is handed to both providers and to the runtime validator, so a schema mismatch would be caught immediately when real credentials are eventually approved.

## Automated validation — `npm run validate:llm` (`scripts/validate-phase8.mjs`)

Unlike Phase 7's validator (which had to duplicate logic because `src/` is TypeScript), this script imports the real server modules directly — no duplication. 25 checks, all passing:

| Area | Checks |
| --- | --- |
| Request schema | valid request accepted; rejects unsupported quiz version, unknown field, unknown option id, over-length text, wrong quizId |
| Result schema | valid content accepted; rejects unapproved capability id, duplicated primary/secondary, wrong signal count, missing direction field |
| Prompt loader/composer | both languages load with a version and the required placeholder; placeholder is correctly replaced with localized answer text |
| Prompt-injection guard | known patterns are flagged and neutralized |
| Mock provider | produces schema-valid output in both languages |
| OpenAI parsing | well-formed completion parses; missing content / non-JSON content both rejected as `INVALID_PROVIDER_OUTPUT` |
| Claude parsing | well-formed tool-use block parses; missing tool-use block rejected as `INVALID_PROVIDER_OUTPUT` |
| Provider fail-safe | both real providers fail with `PROVIDER_UNAVAILABLE` when no API key is configured |
| Rate limiter | allows up to the limit, blocks over it, resets after the window |
| End-to-end | `handleAnalyzeAssessment` returns a valid result via the mock provider, in-process |

Full report: `docs/implementation/validation/phase-8/phase8-validation-report.json`.

## HTTP-level endpoint verification

`docs/implementation/validation/phase-8/phase8-endpoint-check.mjs` against the real local dev server (`server/devServer.mjs`, `LLM_PROVIDER=mock`), results in `phase8-endpoint-check.json`:

| Request | Result |
| --- | --- |
| Valid 6-answer request | `200`, full structured result |
| `quizVersion: "9.9.9"` | `409 UNSUPPORTED_QUIZ_VERSION` |
| Unexpected `utmSource` field | `400 INVALID_ASSESSMENT` |
| Over-length open-text answer (3000 chars) | `400 INVALID_ASSESSMENT` |
| 12 rapid requests (after 4 prior requests in the same window) | first 6 succeed (`200`), remaining 6 rejected (`429 RATE_LIMITED`) — exactly the 10/minute limit |

## Standard checks

- `npm.cmd run build` -> Pass (server/api code is outside `src/`, untouched by the Vite build)
- `npm.cmd run validate:content` -> Pass
- `npm.cmd run validate:language` -> Pass
- `npm.cmd run validate:quiz` -> Pass
- `npm.cmd run validate:llm` -> Pass (new)

## Files created

- `.gitignore` (repository had none before this phase)
- `.env.example`
- `server/api/analyze-assessment.mjs`
- `server/devServer.mjs`
- `server/providers/llm-provider.mjs`, `mock-provider.mjs`, `openai-provider.mjs`, `claude-provider.mjs`
- `server/prompts/he/organizational-insight.md`, `server/prompts/en/organizational-insight.md`
- `server/schemas/assessment-request.schema.mjs`, `insight-result.schema.mjs`
- `server/services/assessment-normalizer.mjs`, `prompt-loader.mjs`, `prompt-composer.mjs`, `result-validator.mjs`, `rate-limiter.mjs`, `prompt-injection-guard.mjs`
- `api/organizational-insight/analyze.mjs`
- `scripts/validate-phase8.mjs`
- `docs/implementation/validation/phase-8/phase8-endpoint-check.mjs`
- `docs/implementation/validation/phase-8/phase8-endpoint-check.json`
- `docs/implementation/validation/phase-8/phase8-validation-report.json`
- `docs/implementation/validation/phase-8/phase8-secure-llm-report.md` (this file)

## Files changed

- `package.json` (added `openai`, `@anthropic-ai/sdk` dependencies; added `server:dev` and `validate:llm` scripts)
- `docs/implementation/huma-website-master-plan.md`

## Known deviations / deferred items

- `server/` files are plain `.mjs`, not `.ts` as the master plan's illustrative structure suggested — a deliberate, low-risk adaptation matching this repo's existing plain-Node-script convention (`scripts/validate-phase*.mjs`) rather than adding a TypeScript execution step or a new build tool.
- Real OpenAI/Claude credentials were never configured or used, per the explicit scope decision — the final provider/model choice remains an open decision (§23), unchanged by this phase.
- Rate limiting is in-memory/per-process, an honest match for the current non-deployed state — production-grade distributed rate limiting is deferred to whenever real hosting (Phase 16) is chosen.
- Cost configuration and usage monitoring (also listed in §16) are deferred — meaningless without a real, billed provider connection.
- The `api/organizational-insight/analyze.mjs` Vercel adapter is inert code — Phase 16 remains not started, nothing was deployed.

## Exit-criteria result

- Secure server endpoint: implemented, framework-agnostic, verified over real HTTP against a local dev server.
- Provider abstraction: implemented; endpoint depends only on the shared interface.
- Mock provider: implemented and exercised end-to-end.
- OpenAI provider: implemented, correctly parses realistic responses, fails safe with no credentials, never called over the network.
- Claude provider: implemented, correctly parses realistic responses, fails safe with no credentials, never called over the network.
- External Hebrew and English prompts: implemented, versioned, verified.
- Prompt loader / prompt composer: implemented as dedicated modules.
- Request validation: implemented against the real quiz schema.
- Structured result schema / result validation: implemented, provider-independent.
- Failure handling: all required failure states are classified with distinct codes.
- Rate limiting: implemented and verified.
- Prompt-injection protection: implemented as a documented best-effort mitigation.
- The browser never calls OpenAI or Claude directly, never receives API keys, never receives raw provider errors or stack traces.
- No Phase 9 or later work was started. No Git modification was performed. No deployment was performed.

Recommended Phase 8 status: `READY FOR REVIEW`
