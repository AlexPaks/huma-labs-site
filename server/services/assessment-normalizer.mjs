import assessmentDefinition from "../../content/assessment.json" with { type: "json" };
import assessmentMessagesHe from "../../messages/he/assessment.json" with { type: "json" };
import assessmentMessagesEn from "../../messages/en/assessment.json" with { type: "json" };
import { sanitizeOpenTextForPrompt } from "./prompt-injection-guard.mjs";

const assessmentMessagesByLanguage = { he: assessmentMessagesHe, en: assessmentMessagesEn };
const questionsById = Object.fromEntries(assessmentDefinition.questions.map((question) => [question.id, question]));

function readMessageLeaf(catalog, ref) {
  const [, dottedPath] = ref.split(":");
  const segments = dottedPath.split(".");
  let current = catalog;

  for (const segment of segments) {
    if (!current || typeof current !== "object" || !(segment in current)) {
      return null;
    }
    current = current[segment];
  }

  return typeof current === "string" ? current : null;
}

/**
 * Turns validated {questionId, value} answers into the localized
 * question/answer text the prompt composer needs, applying the
 * prompt-injection guard to every piece of free text along the way.
 * Only approved quiz content and the user's own answers ever pass through
 * here — no campaign/attribution data, no contact-form data.
 */
export function normalizeAssessmentForPrompt(request) {
  const messages = assessmentMessagesByLanguage[request.language];
  let anyFlagged = false;

  const normalizedAnswers = request.answers.map((answer) => {
    const question = questionsById[answer.questionId];
    const questionText = readMessageLeaf(messages, question.questionRef) ?? question.id;

    if (question.type === "single-choice") {
      const option = question.options.find((candidate) => candidate.id === answer.value);
      const optionText = option ? readMessageLeaf(messages, option.labelRef) ?? option.id : "(no answer)";
      return {
        questionId: question.id,
        questionText,
        answerText: optionText,
        selectedOptions: option
          ? [{ label: optionText, themes: option.analysis?.themes ?? [], capability: question.capabilityMapping?.[option.id] ?? null }]
          : [],
        openText: null,
      };
    }

    if (question.type === "multiple-choice") {
      const selectedOptions = answer.value.flatMap((optionId) => {
        const option = question.options.find((candidate) => candidate.id === optionId);
        if (!option) {
          return [];
        }
        return [{
          label: readMessageLeaf(messages, option.labelRef) ?? option.id,
          themes: option.analysis?.themes ?? [],
          capability: question.capabilityMapping?.[option.id] ?? null,
          audienceScope: option.analysis?.audienceScope ?? null,
          isAmbiguous: option.analysis?.isAmbiguous === true,
        }];
      });
      return {
        questionId: question.id,
        questionText,
        answerText: selectedOptions.map((option) => option.label).join(", ") || "(no answer)",
        selectedOptions,
        openText: null,
      };
    }

    const { sanitized, flagged } = sanitizeOpenTextForPrompt(answer.value || "(no answer)");
    if (flagged) {
      anyFlagged = true;
    }
    return { questionId: question.id, questionText, answerText: sanitized, selectedOptions: [], openText: sanitized };
  });

  const capabilitySignals = [...new Set(normalizedAnswers.flatMap((answer) =>
    answer.selectedOptions.map((option) => option.capability).filter(Boolean),
  ))];
  const themeSignals = [...new Set(normalizedAnswers.flatMap((answer) =>
    answer.selectedOptions.flatMap((option) => option.themes),
  ))];
  const questionTextsByTheme = new Map();
  for (const answer of normalizedAnswers) {
    for (const theme of answer.selectedOptions.flatMap((option) => option.themes)) {
      const questionTexts = questionTextsByTheme.get(theme) ?? new Set();
      questionTexts.add(answer.questionText);
      questionTextsByTheme.set(theme, questionTexts);
    }
  }
  const logicalLinks = [...questionTextsByTheme.entries()]
    .filter(([, questionTexts]) => questionTexts.size > 1)
    .map(([theme, questionTexts]) => ({ theme, questions: [...questionTexts] }));
  const targetAudiences = normalizedAnswers
    .find((answer) => answer.questionId === "audience")
    ?.selectedOptions.map((option) => option.label) ?? [];
  const ambiguityFlags = normalizedAnswers
    .filter((answer) => answer.selectedOptions.some((option) => option.isAmbiguous))
    .map((answer) => answer.questionText);

  return {
    language: request.language,
    quizVersion: request.quizVersion,
    answers: normalizedAnswers,
    structuredContext: {
      capabilitySignals,
      themeSignals,
      logicalLinks,
      targetAudiences,
      ambiguityFlags,
      consistency: { status: "validated", conflicts: [] },
    },
    promptInjectionFlagged: anyFlagged,
  };
}
