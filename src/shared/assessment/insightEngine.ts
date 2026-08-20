import type { VisibleWhenCondition } from "./assessmentCatalog";

export type AnswerValue = string | string[];
export type AnswersById = Record<string, AnswerValue>;

export type QuizQuestionType = "single-choice" | "multiple-choice" | "short-text" | "long-text";

export interface QuizFlowOption {
  id: string;
  nextQuestionId?: string | null;
}

export interface QuizFlowQuestion {
  id: string;
  order: number;
  type: QuizQuestionType;
  required: boolean;
  nextQuestionId?: string | null;
  options: QuizFlowOption[];
  validation: {
    minSelections?: number;
    maxSelections?: number;
    minLength?: number;
    maxLength?: number;
  };
  visibleWhen?: VisibleWhenCondition | null;
  capabilityMapping?: Record<string, string> | null;
}

function toValueList(value: AnswerValue | undefined): string[] {
  if (Array.isArray(value)) {
    return value;
  }

  return value ? [value] : [];
}

export function evaluateVisibility(
  condition: VisibleWhenCondition | null | undefined,
  answers: AnswersById,
): boolean {
  if (!condition) {
    return true;
  }

  const answerValues = toValueList(answers[condition.questionId]);

  if (condition.equals !== undefined && condition.equals !== null) {
    return answerValues.includes(condition.equals);
  }

  if (condition.in) {
    return answerValues.some((value) => condition.in!.includes(value));
  }

  if (condition.notEquals !== undefined && condition.notEquals !== null) {
    return !answerValues.includes(condition.notEquals);
  }

  return true;
}

export function getVisibleQuestions<T extends QuizFlowQuestion>(
  questions: T[],
  answers: AnswersById,
): T[] {
  return [...questions]
    .sort((left, right) => left.order - right.order)
    .filter((question) => evaluateVisibility(question.visibleWhen, answers));
}

export function resolveNextQuestionId<T extends QuizFlowQuestion>(
  question: T,
  answerValue: AnswerValue,
  visibleQuestions: T[],
): string | null {
  if (question.type === "single-choice" && typeof answerValue === "string") {
    const option = question.options.find((candidate) => candidate.id === answerValue);
    if (option?.nextQuestionId) {
      return option.nextQuestionId;
    }
  }

  if (question.nextQuestionId) {
    return question.nextQuestionId;
  }

  const currentPosition = visibleQuestions.findIndex((candidate) => candidate.id === question.id);
  return visibleQuestions[currentPosition + 1]?.id ?? null;
}

export function isAnswerValid(question: QuizFlowQuestion, value: AnswerValue): boolean {
  if (question.type === "multiple-choice") {
    const values = Array.isArray(value) ? value : [];
    const min = question.validation.minSelections ?? (question.required ? 1 : 0);
    const max = question.validation.maxSelections ?? Number.POSITIVE_INFINITY;
    return values.length >= min && values.length <= max;
  }

  if (question.type === "single-choice") {
    const hasSelection = typeof value === "string" && value.length > 0;
    return question.required ? hasSelection : true;
  }

  const text = typeof value === "string" ? value.trim() : "";
  const minLength = question.validation.minLength ?? (question.required ? 1 : 0);
  const maxLength = question.validation.maxLength ?? Number.POSITIVE_INFINITY;
  return text.length >= minLength && text.length <= maxLength;
}

export interface InsightCompletionAnswer {
  questionId: string;
  value: AnswerValue;
}

export interface InsightCompletionPayload {
  quizId: string;
  quizVersion: string;
  language: string;
  visitedQuestionIds: string[];
  answers: InsightCompletionAnswer[];
}

export function buildCompletionPayload(
  quizId: string,
  quizVersion: string,
  language: string,
  visitedQuestionIds: string[],
  answers: AnswersById,
): InsightCompletionPayload {
  return {
    quizId,
    quizVersion,
    language,
    visitedQuestionIds,
    answers: visitedQuestionIds.map((questionId) => ({
      questionId,
      value: answers[questionId] ?? "",
    })),
  };
}

export interface MockInsightResult {
  isMock: true;
  primaryCapabilityId: string | null;
  capabilityTally: Record<string, number>;
}

export function buildMockInsightResult(
  payload: InsightCompletionPayload,
  questionsById: Record<string, QuizFlowQuestion>,
): MockInsightResult {
  const tally: Record<string, number> = {};

  for (const answer of payload.answers) {
    const capabilityMapping = questionsById[answer.questionId]?.capabilityMapping;

    if (!capabilityMapping) {
      continue;
    }

    for (const value of toValueList(answer.value)) {
      const capabilityId = capabilityMapping[value];

      if (capabilityId) {
        tally[capabilityId] = (tally[capabilityId] ?? 0) + 1;
      }
    }
  }

  const [topEntry] = Object.entries(tally).sort((left, right) => right[1] - left[1]);

  return {
    isMock: true,
    primaryCapabilityId: topEntry?.[0] ?? null,
    capabilityTally: tally,
  };
}
