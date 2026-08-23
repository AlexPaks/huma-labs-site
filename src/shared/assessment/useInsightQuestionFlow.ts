import { useState } from "react";
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

function getStorageKey(quizId: string, quizVersion: string) {
  return `huma-quiz-${quizId}-${quizVersion}`;
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

  // Quiz answers can include organizational free text. Clear data written by
  // the earlier resume feature and keep all new answers in memory only.
  const [visitedQuestionIds, setVisitedQuestionIds] = useState<string[]>(() => {
    clearPersistedState(storageKey);
    return firstQuestionId ? [firstQuestionId] : [];
  });

  const [answers, setAnswers] = useState<AnswersById>(() => createEmptyAnswers(questions));

  const [showValidation, setShowValidation] = useState(false);

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
    hasResumedProgress: false,
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
