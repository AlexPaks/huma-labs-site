import { useEffect, useState } from "react";
import type { VisibleWhenCondition } from "./assessmentCatalog";
import {
  buildCompletionPayload,
  buildMockInsightResult,
  getVisibleQuestions,
  isAnswerValid,
  resolveNextQuestionId,
  type AnswersById,
  type InsightCompletionPayload,
  type MockInsightResult,
} from "./insightEngine";

export type InsightQuestionOption = {
  id: string;
  label: string;
  nextQuestionId?: string | null;
};

export type InsightQuestion = {
  id: string;
  order: number;
  type: "single-choice" | "multiple-choice" | "short-text" | "long-text";
  required: boolean;
  question: string;
  helper?: string | null;
  prompt?: string | null;
  nextQuestionId?: string | null;
  options: InsightQuestionOption[];
  validation: {
    minSelections?: number;
    maxSelections?: number;
    minLength?: number;
    maxLength?: number;
  };
  visibleWhen?: VisibleWhenCondition | null;
  capabilityMapping?: Record<string, string> | null;
};

export type InsightAnswerValue = string | string[];

interface PersistedFlowState {
  visitedQuestionIds: string[];
  answers: AnswersById;
}

function getStorageKey(quizId: string, quizVersion: string) {
  return `huma-quiz-${quizId}-${quizVersion}`;
}

function readPersistedState(storageKey: string): PersistedFlowState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedFlowState> | null;

    if (
      parsed &&
      Array.isArray(parsed.visitedQuestionIds) &&
      parsed.visitedQuestionIds.every((id) => typeof id === "string") &&
      parsed.answers &&
      typeof parsed.answers === "object"
    ) {
      return { visitedQuestionIds: parsed.visitedQuestionIds, answers: parsed.answers };
    }

    return null;
  } catch {
    return null;
  }
}

function writePersistedState(storageKey: string, state: PersistedFlowState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Ignore storage failures and continue with in-memory state only.
  }
}

function clearPersistedState(storageKey: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // Ignore storage failures.
  }
}

function getInitialAnswerValue(question: InsightQuestion): InsightAnswerValue {
  return question.type === "multiple-choice" ? [] : "";
}

function createEmptyAnswers(questions: InsightQuestion[]): AnswersById {
  return Object.fromEntries(
    questions.map((question) => [question.id, getInitialAnswerValue(question)]),
  );
}

function hasAnyAnswerValue(answers: AnswersById) {
  return Object.values(answers).some((value) =>
    Array.isArray(value) ? value.length > 0 : String(value ?? "").trim().length > 0,
  );
}

export interface UseInsightQuestionFlowOptions {
  quizId: string;
  quizVersion: string;
  language: string;
  onCompleted?: (payload: InsightCompletionPayload, mockResult: MockInsightResult) => void;
}

export function useInsightQuestionFlow(
  questions: InsightQuestion[],
  options: UseInsightQuestionFlowOptions,
) {
  const { quizId, quizVersion, language, onCompleted } = options;
  const storageKey = getStorageKey(quizId, quizVersion);
  const firstQuestionId = questions[0]?.id ?? "";

  const [visitedQuestionIds, setVisitedQuestionIds] = useState<string[]>(() => {
    const persisted = readPersistedState(storageKey);
    const validPersistedPath = persisted?.visitedQuestionIds.filter((id) =>
      questions.some((question) => question.id === id),
    );

    if (validPersistedPath && validPersistedPath.length > 0) {
      return validPersistedPath;
    }

    return firstQuestionId ? [firstQuestionId] : [];
  });

  const [answers, setAnswers] = useState<AnswersById>(() => {
    const persisted = readPersistedState(storageKey);
    return { ...createEmptyAnswers(questions), ...(persisted?.answers ?? {}) };
  });

  const [showValidation, setShowValidation] = useState(false);

  const [hasResumedProgress] = useState<boolean>(() => {
    const persisted = readPersistedState(storageKey);
    if (!persisted) {
      return false;
    }

    return persisted.visitedQuestionIds.length > 1 || hasAnyAnswerValue(persisted.answers);
  });

  const visibleQuestions = getVisibleQuestions(questions, answers);
  const currentQuestionId = visitedQuestionIds[visitedQuestionIds.length - 1] ?? firstQuestionId;
  const currentQuestion =
    questions.find((question) => question.id === currentQuestionId) ?? questions[0];
  const currentIndex = Math.max(
    0,
    visibleQuestions.findIndex((question) => question.id === currentQuestion?.id),
  );
  const totalQuestions = visibleQuestions.length;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : "";
  const hasAnswer = currentQuestion ? isAnswerValid(currentQuestion, currentAnswer) : false;

  useEffect(() => {
    if (!currentQuestion) {
      return;
    }

    writePersistedState(storageKey, { visitedQuestionIds, answers });
  }, [storageKey, currentQuestion, visitedQuestionIds, answers]);

  function updateSingleAnswer(nextValue: string) {
    if (!currentQuestion) {
      return;
    }

    setShowValidation(false);
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: nextValue,
    }));
  }

  function updateMultipleAnswer(optionId: string) {
    if (!currentQuestion) {
      return;
    }

    setShowValidation(false);
    setAnswers((current) => {
      const currentValues = Array.isArray(current[currentQuestion.id])
        ? [...(current[currentQuestion.id] as string[])]
        : [];
      const nextValues = currentValues.includes(optionId)
        ? currentValues.filter((value) => value !== optionId)
        : [...currentValues, optionId];

      return {
        ...current,
        [currentQuestion.id]: nextValues,
      };
    });
  }

  function moveToQuestion(index: number) {
    const target = visibleQuestions[index];
    if (!target) {
      return;
    }

    setShowValidation(false);
    setVisitedQuestionIds((current) => [...current, target.id]);
  }

  function moveBack() {
    setShowValidation(false);
    setVisitedQuestionIds((current) => (current.length > 1 ? current.slice(0, -1) : current));
  }

  function handleContinue() {
    if (!currentQuestion) {
      return false;
    }

    if (!isAnswerValid(currentQuestion, currentAnswer)) {
      setShowValidation(true);
      return false;
    }

    const nextQuestionId = resolveNextQuestionId(currentQuestion, currentAnswer, visibleQuestions);

    if (!nextQuestionId) {
      const payload = buildCompletionPayload(
        quizId,
        quizVersion,
        language,
        visitedQuestionIds,
        answers,
      );
      const questionsById = Object.fromEntries(questions.map((question) => [question.id, question]));
      const mockResult = buildMockInsightResult(payload, questionsById);

      // Persisted answers are intentionally kept until the caller confirms a
      // result was actually obtained and shown (see clearPersistedProgress
      // below) — if the analysis request fails, the user must not lose their
      // completed answers.
      onCompleted?.(payload, mockResult);
      return true;
    }

    setShowValidation(false);
    setVisitedQuestionIds((current) => [...current, nextQuestionId]);
    return true;
  }

  function resetFlow() {
    clearPersistedState(storageKey);
    setVisitedQuestionIds(firstQuestionId ? [firstQuestionId] : []);
    setAnswers(createEmptyAnswers(questions));
    setShowValidation(false);
  }

  return {
    answers,
    currentAnswer,
    currentIndex,
    currentQuestion,
    hasAnswer,
    hasResumedProgress,
    moveBack,
    moveToQuestion,
    questions: visibleQuestions,
    resetFlow,
    showValidation,
    totalQuestions,
    updateMultipleAnswer,
    updateSingleAnswer,
    handleContinue,
  };
}
