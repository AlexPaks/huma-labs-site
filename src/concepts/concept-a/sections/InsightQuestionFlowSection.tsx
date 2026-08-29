import { useEffect, useRef } from "react";
import type {
  InsightAnswerValue,
  InsightQuestion,
} from "../../../shared/assessment/useInsightQuestionFlow";

type InsightQuestionFlowSectionProps = {
  sectionId?: string;
  label: string;
  questions: InsightQuestion[];
  currentIndex: number;
  currentQuestion: InsightQuestion;
  currentAnswer: InsightAnswerValue;
  totalQuestions: number;
  showValidation: boolean;
  backLabel: string;
  continueLabel: string;
  progressLabel: (current: number, total: number) => string;
  onBack: () => void;
  onContinue: () => void;
  onSingleAnswerChange: (nextValue: string) => void;
  onMultipleAnswerToggle: (optionId: string) => void;
  validationMessage: string;
  selectionFeedback?: string | null;
  selectionCountLabel?: (selected: number, max: number) => string;
  variant?: "default" | "page";
  dataPrimaryState?: "question";
};

export function InsightQuestionFlowSection({
  sectionId,
  label,
  questions,
  currentIndex,
  currentQuestion,
  currentAnswer,
  totalQuestions,
  showValidation,
  backLabel,
  continueLabel,
  progressLabel,
  onBack,
  onContinue,
  onSingleAnswerChange,
  onMultipleAnswerToggle,
  validationMessage,
  selectionFeedback,
  selectionCountLabel,
  variant = "default",
  dataPrimaryState,
}: InsightQuestionFlowSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const initialIndexRef = useRef(currentIndex);
  const validationId = `${currentQuestion.id}-validation`;
  const hasAnswer = Array.isArray(currentAnswer)
    ? currentAnswer.length > 0
    : String(currentAnswer).trim().length > 0;
  const selectedCount = Array.isArray(currentAnswer) ? currentAnswer.length : 0;
  const maxSelections = currentQuestion.validation.maxSelections ?? 0;

  useEffect(() => {
    if (currentIndex === initialIndexRef.current) {
      return;
    }

    containerRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [currentIndex]);

  return (
    <section
      className={
        variant === "page"
          ? "concept-section concept-section--insight-page"
          : "concept-section"
      }
      data-primary-state={dataPrimaryState}
      id={sectionId ?? "insight-flow"}
      ref={containerRef}
    >
      <div
        className={
          variant === "page"
            ? "concept-container concept-insight-flow concept-insight-flow--page"
            : "concept-container concept-insight-flow"
        }
      >
        <div className="concept-insight-flow__progress">
          <p className="concept-kicker">{label}</p>
          <div className="concept-progress">
            {questions.map((question, index) => {
              const isActive = index === currentIndex;
              const isComplete = index < currentIndex;
              return (
                <span
                  key={question.id}
                  className={
                    isActive
                      ? "concept-progress__dot concept-progress__dot--active"
                      : isComplete
                        ? "concept-progress__dot concept-progress__dot--complete"
                        : "concept-progress__dot"
                  }
                />
              );
            })}
          </div>
          <p className="concept-insight-flow__progress-label">
            {progressLabel(currentIndex + 1, totalQuestions)}
          </p>
        </div>

        <div className="concept-insight-flow__layout">
          <div className="concept-insight-flow__prompt">
            <h2 className="concept-display">{currentQuestion.question}</h2>
            {currentQuestion.helper ? (
              <p className="concept-insight-flow__helper">{currentQuestion.helper}</p>
            ) : null}
          </div>

          <div className="concept-insight-flow__answers">
            {currentQuestion.type === "short-text" || currentQuestion.type === "long-text" ? (
              <label className="concept-insight-flow__textarea-wrap">
                <span className="sr-only">{currentQuestion.question}</span>
                <textarea
                  aria-describedby={showValidation ? validationId : undefined}
                  aria-invalid={showValidation && !hasAnswer}
                  className="field concept-insight-flow__textarea"
                  dir="auto"
                  onChange={(event) => onSingleAnswerChange(event.target.value)}
                  placeholder={currentQuestion.prompt ?? ""}
                  value={typeof currentAnswer === "string" ? currentAnswer : ""}
                />
              </label>
            ) : (
              <>
                {currentQuestion.type === "multiple-choice" && selectionCountLabel ? (
                  <p aria-live="polite" className="concept-insight-flow__helper">
                    {selectionCountLabel(selectedCount, maxSelections)}
                  </p>
                ) : null}
                <div className="concept-answer-list">
                  {currentQuestion.options.map((option) => {
                  const isSelected = Array.isArray(currentAnswer)
                    ? currentAnswer.includes(option.id)
                    : currentAnswer === option.id;

                  return (
                    <button
                      key={option.id}
                      aria-pressed={isSelected}
                      aria-describedby={showValidation ? validationId : undefined}
                      className={
                        isSelected
                          ? "concept-answer-list__option concept-answer-list__option--selected"
                          : "concept-answer-list__option"
                      }
                      onClick={() => {
                        if (currentQuestion.type === "multiple-choice") {
                          onMultipleAnswerToggle(option.id);
                          return;
                        }

                        onSingleAnswerChange(option.id);
                      }}
                      type="button"
                    >
                      <span className="concept-answer-list__marker" aria-hidden="true" />
                      <span>{option.label}</span>
                    </button>
                  );
                  })}
                </div>
              </>
            )}
            {selectionFeedback ? (
              <p aria-live="polite" className="concept-insight-flow__error">
                {selectionFeedback}
              </p>
            ) : null}
            {showValidation ? (
              <p
                aria-live="polite"
                className="concept-insight-flow__error"
                id={validationId}
              >
                {validationMessage}
              </p>
            ) : null}
          </div>
        </div>

        <div className="concept-insight-flow__controls">
          <button
            className="concept-button concept-insight-flow__back"
            disabled={currentIndex === 0}
            onClick={onBack}
            type="button"
          >
            {backLabel}
          </button>

          <button
            className="concept-button"
            onClick={onContinue}
            type="button"
          >
            {continueLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
