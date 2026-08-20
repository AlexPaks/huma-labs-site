# Phase 7 — Dynamic Assessment Engine Verification Report

Date: 2026-08-19
Phase: Phase 7 - Dynamic Assessment Engine

## Scope decision confirmed with the user

Before implementation, the user was asked how far to apply branching/conditional-visibility to the six approved questions. Decision: build a fully generic engine, but keep the real content's default behavior unchanged (linear 1→2→3→4→5→6, all six questions always visible). Branching and conditional visibility are proven with a synthetic fixture inside the validation script rather than by hiding or reordering any approved question.

## What was implemented

- **Pure engine module** (`src/shared/assessment/insightEngine.ts`): `evaluateVisibility`, `getVisibleQuestions`, `resolveNextQuestionId`, `isAnswerValid`, `buildCompletionPayload`, `buildMockInsightResult`. No React, no I/O — plain functions operating on schema + answers.
- **Conditional visibility**: each question may carry a `visibleWhen` condition (`{questionId, equals | in | notEquals}`) evaluated against current answers. All six approved questions keep `visibleWhen: null` (always visible).
- **Branching**: `nextQuestionId` now resolves per selected option first (new optional `AssessmentOption.nextQuestionId`), falling back to the existing question-level `nextQuestionId`, falling back to natural order among currently-visible questions. The six approved questions rely only on their existing question-level `nextQuestionId` chain, so the default flow is unchanged.
- **Real validation rules**: answers are now checked against each question's actual `validation` (minSelections/maxSelections for choice types, minLength/maxLength for text types, `required`), replacing the previous generic "non-empty" check.
- **Capability mapping / mock result**: `content/assessment.json` now carries real `capabilityMapping` (option id → one of the four approved capability ids: presence, resilience, adaptability, leadership) for the three questions where that mapping is genuinely meaningful (`challenge`, `impact`, `desired-change`). `audience` and `current-state` were deliberately left unmapped — they signal target population and readiness, not a HUMA capability, and mapping them would have invented meaning not present in the approved content. On completion, `buildMockInsightResult` tallies the mapped capabilities and returns a primary capability id — a real, locally-computed mock result, with no LLM call (per the Phase 7 explicit exclusion). This value is not wired into the visible result card; dynamic result rendering remains Phase 9's responsibility.
- **Completion payload**: on finishing the quiz, a structured `{quizId, quizVersion, language, visitedQuestionIds, answers}` object is built and handed to `onCompleted`, together with the mock result.
- **Safe local persistence**: in-progress `{visitedQuestionIds, answers}` are saved to `localStorage` under a versioned key (`huma-quiz-{quizId}-{quizVersion}`), independent of language (answers are stored as option ids, not label text, so the same storage is valid across a language switch). Cleared on successful completion or explicit restart.
- **Fixed a real bug found during this phase**: the previous `InsightPage` reset the whole Quiz (back to intro, answers cleared) on every `location.pathname` change — which fires on a language switch (`/he/insight` ↔ `/en/insight`), not just on entering the page. This silently violated the "answer preservation across language switching" requirement. The effect was removed; a fresh mount now restores from persisted state via lazy `useState` initializers instead, so home↔insight navigation, a language switch, and even a full page reload all correctly preserve in-progress answers.
- **Branch-aware back navigation**: `moveBack()` now pops a `visitedQuestionIds` stack instead of doing `currentIndex - 1` arithmetic, so "back" is correct even when branching skips a question (verified with the synthetic fixture).
- **Restart**: a small "retake the assessment" control was added to both concepts' Result sections, wired to a new `resetFlow()` call that also clears persisted storage.

## Verification performed

### Automated schema/engine validation — `npm run validate:quiz` (`scripts/validate-phase7.mjs`)

New script, following this repo's existing convention (plain-JS Node scripts, no TypeScript import step) of a small mirrored implementation of the pure engine logic:

| Check | Result |
| --- | --- |
| No duplicate question/option ids | Pass |
| All `nextQuestionId` references (question- and option-level) point to real questions | Pass |
| All `visibleWhen` references point to an earlier question | Pass |
| All `capabilityMapping` entries reference real option ids and one of the four approved capability ids | Pass |
| Default content keeps every question unconditionally visible (regression guard for the scope decision above) | Pass |
| Full walkthrough of the real `content/assessment.json` visits exactly the six approved questions, in the unchanged 1→6 order | Pass |
| Full walkthrough produces a mock result with an approved primary capability id | Pass (`resilience` for the default synthetic answers) |
| Empty / over-length / valid long-text answers are correctly rejected/accepted | Pass |
| Synthetic branching fixture: selecting "branch-x" skips the conditionally-irrelevant question | Pass |
| Synthetic branching fixture: selecting "branch-y" shows the conditionally-relevant question | Pass |

Full report: `docs/implementation/validation/phase-7/phase7-validation-report.json`.

### Browser verification (local Microsoft Edge headless via CDP)

`docs/implementation/validation/phase-7/phase7-quiz-check.cjs`, results in `phase7-quiz-check.json`:

| Scenario | Result |
| --- | --- |
| Full completion, Concept A, Hebrew, all 6 questions | Reaches the result state; completion payload lists all 6 answers in order; mock result computed with an approved capability id |
| Restart from the result screen | Returns to intro; `localStorage` reset to the initial empty state |
| Persistence across a full page reload mid-flow (answered Q1, reloaded) | Resumes directly at "Question 2 of 6" with Q1's answer intact |
| Language switch mid-flow (`/he/insight` → `/en/insight` while on Q2) | Progress and answers preserved — confirms the reset-on-pathname-change bug is fixed |
| Full completion, Concept C, English | Reaches the result state; same payload/mock-result shape; no console warnings or errors |

No console warnings or errors were recorded in any of the above scenarios.

Screenshots:
- `docs/implementation/validation/phase-7/phase7-result-with-restart-he.png` — result screen showing the new restart control
- `docs/implementation/validation/phase-7/phase7-intro-mobile-he.png` — mobile Insight intro, confirming no layout regression

### Standard checks

- `npm.cmd run build` -> Pass
- `npm.cmd run validate:content` -> Pass
- `npm.cmd run validate:language` -> Pass
- `npm.cmd run validate:quiz` -> Pass (new)

## Files created

- `src/shared/assessment/insightEngine.ts`
- `scripts/validate-phase7.mjs`
- `docs/implementation/validation/phase-7/phase7-quiz-check.cjs`
- `docs/implementation/validation/phase-7/phase7-quiz-check.json`
- `docs/implementation/validation/phase-7/phase7-validation-report.json`
- `docs/implementation/validation/phase-7/phase7-result-with-restart-he.png`
- `docs/implementation/validation/phase-7/phase7-intro-mobile-he.png`
- `docs/implementation/validation/phase-7/phase7-dynamic-assessment-report.md` (this file)

## Files changed

- `src/shared/assessment/assessmentCatalog.ts` (added `VisibleWhenCondition`, `AssessmentOption.nextQuestionId`, typed `visibleWhen`/`capabilityMapping`/`scoreMapping`)
- `src/shared/assessment/useInsightQuestionFlow.ts` (rewritten: engine-backed, branch-aware back navigation, persistence, completion payload/mock result, `hasResumedProgress`)
- `src/pages/InsightPage.tsx` (removed the pathname-reset bug; wires the new hook options API, restart handler, and a debug-only `window.__HUMA_DEBUG_LAST_INSIGHT_RESULT__` for verification)
- `src/concepts/concept-a/sections/InsightResultSection.tsx`, `src/concepts/concept-c/sections/ConceptCInsightResultSection.tsx` (added optional `restartLabel`/`onRestart`)
- `content/assessment.json` (added real `capabilityMapping` to `challenge`, `impact`, `desired-change`; all other fields and all six questions/options unchanged)
- `messages/he/insight-result.json`, `messages/en/insight-result.json` (added `actions.restart`)
- `src/styles.css` (`.concept-result__restart`, `.concept-c-result__restart` spacing)
- `package.json` (added `validate:quiz` script)

## Known deviations / deferred items

- `audience` and `current-state` questions intentionally have no `capabilityMapping` — mapping them would invent meaning not present in the approved content.
- Branching/conditional-visibility are proven generically (schema support + synthetic fixture) but not exercised on the live six questions, per the explicit user decision.
- The result UI still renders static structured content (unrelated to the computed mock result) — dynamic result rendering is explicitly Phase 9's responsibility, not Phase 7's.
- `scoreMapping` is supported by the schema but left `null` throughout; no current requirement needs it.

## Exit-criteria result

- External Quiz definition: unchanged, already externalized since Phase 2.
- Schema-driven rendering: unchanged rendering components, now genuinely driven by the schema-derived engine rather than a hardcoded `currentIndex + 1`.
- Dynamic number of questions: engine computes visible-question count from `visibleWhen`, not a hardcoded 6.
- Conditional visibility: implemented and proven (synthetic fixture).
- Branching: implemented and proven (synthetic fixture; per-option `nextQuestionId` support).
- Validation: real per-question-type rules (minLength/maxLength, minSelections/maxSelections), not just "non-empty".
- Persistence: safe local persistence across reload, home↔insight navigation, and language switching.
- Completion payload: structured payload produced on completion.
- Mock result: real, locally-computed mock result (capability tally), no LLM call.
- Hebrew / English: verified both.
- Concept A / Concept C: verified both.
- No external LLM call was added.
- No Phase 8 or later work was started.
- No Git modification was performed. No deployment was performed.

Recommended Phase 7 status: `READY FOR REVIEW`
