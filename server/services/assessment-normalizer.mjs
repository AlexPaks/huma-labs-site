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
      return { questionId: question.id, questionText, answerText: optionText };
    }

    if (question.type === "multiple-choice") {
      const optionTexts = answer.value.map((optionId) => {
        const option = question.options.find((candidate) => candidate.id === optionId);
        return option ? readMessageLeaf(messages, option.labelRef) ?? option.id : optionId;
      });
      return { questionId: question.id, questionText, answerText: optionTexts.join(", ") || "(no answer)" };
    }

    const { sanitized, flagged } = sanitizeOpenTextForPrompt(answer.value || "(no answer)");
    if (flagged) {
      anyFlagged = true;
    }
    return { questionId: question.id, questionText, answerText: sanitized };
  });

  return {
    language: request.language,
    quizVersion: request.quizVersion,
    answers: normalizedAnswers,
    promptInjectionFlagged: anyFlagged,
  };
}
