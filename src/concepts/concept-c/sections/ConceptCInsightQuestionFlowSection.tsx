import { useEffect, useRef } from "react";
import type {
  InsightAnswerValue,
  InsightQuestion,
} from "../../../shared/assessment/useInsightQuestionFlow";

type ConceptCInsightQuestionFlowSectionProps = {
  sectionId?: string;
  label: string;
  questions: InsightQuestion[];
  currentIndex: number;
  currentQuestion: InsightQuestion;
  currentAnswer: InsightAnswerValue;
  totalQuestions: number;
  showValidation: boolean;
  validationMessage: string;
  backLabel: string;
  continueLabel: string;
  progressLabel: (current: number, total: number) => string;
  onBack: () => void;
  onContinue: () => void;
  onSingleAnswerChange: (nextValue: string) => void;
  onMultipleAnswerToggle: (optionId: string) => void;
  selectionFeedback?: string | null;
  selectionCountLabel?: (selected: number, max: number) => string;
  dataPrimaryState?: "question";
};

export function ConceptCInsightQuestionFlowSection({
  sectionId,
  label,
  questions,
  currentIndex,
  currentQuestion,
  currentAnswer,
  totalQuestions,
  showValidation,
  validationMessage,
  backLabel,
  continueLabel,
  progressLabel,
  onBack,
  onContinue,
  onSingleAnswerChange,
  onMultipleAnswerToggle,
  selectionFeedback,
  selectionCountLabel,
  dataPrimaryState,
}: ConceptCInsightQuestionFlowSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const initialIndexRef = useRef(currentIndex);
  const validationId = `${currentQuestion.id}-validation`;
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
      className="concept-section concept-section--insight-page concept-c-insight-flow"
      data-primary-state={dataPrimaryState}
      id={sectionId ?? "insight-flow"}
      ref={containerRef}
    >
      <div className="concept-container concept-c-insight-flow__layout">
        <header className="concept-c-insight-flow__progress">
          <p className="concept-kicker">{label}</p>
          <div className="concept-c-insight-flow__rail" aria-hidden="true">
            {questions.map((question, index) => (
              <span
                key={question.id}
                className={
                  index === currentIndex
                    ? "concept-c-insight-flow__step concept-c-insight-flow__step--active"
                    : index < currentIndex
                      ? "concept-c-insight-flow__step concept-c-insight-flow__step--complete"
                      : "concept-c-insight-flow__step"
                }
              />
            ))}
          </div>
          <p className="concept-c-insight-flow__progress-label">
            {progressLabel(currentIndex + 1, totalQuestions)}
          </p>
        </header>

        <div className="concept-c-insight-flow__body">
          <aside className="concept-c-insight-flow__journey">
            <ol>
              {questions.map((question, index) => (
                <li
                  key={question.id}
                  className={index === currentIndex ? "concept-c-insight-flow__journey-item concept-c-insight-flow__journey-item--active" : "concept-c-insight-flow__journey-item"}
                >
                  <span>{question.question}</span>
                </li>
              ))}
            </ol>
          </aside>

          <div className="concept-c-insight-flow__question">
            <h2>{currentQuestion.question}</h2>
            {currentQuestion.helper ? (
              <p className="concept-c-insight-flow__helper">{currentQuestion.helper}</p>
            ) : null}

            {currentQuestion.type === "short-text" || currentQuestion.type === "long-text" ? (
              <label className="concept-c-insight-flow__textarea-wrap">
                <span className="sr-only">{currentQuestion.question}</span>
                <textarea
                  aria-describedby={showValidation ? validationId : undefined}
                  aria-invalid={showValidation}
                  className="field concept-c-insight-flow__textarea"
                  dir="auto"
                  onChange={(event) => onSingleAnswerChange(event.target.value)}
                  placeholder={currentQuestion.prompt ?? ""}
                  value={typeof currentAnswer === "string" ? currentAnswer : ""}
                />
              </label>
            ) : (
              <>
                {currentQuestion.type === "multiple-choice" && selectionCountLabel ? (
                  <p aria-live="polite" className="concept-c-insight-flow__helper">
                    {selectionCountLabel(selectedCount, maxSelections)}
                  </p>
                ) : null}
                <div className="concept-c-insight-flow__answers">
                  {currentQuestion.options.map((option) => {
                  const isSelected = Array.isArray(currentAnswer)
                    ? currentAnswer.includes(option.id)
                    : currentAnswer === option.id;

                  return (
                    <button
                      key={option.id}
                      aria-describedby={showValidation ? validationId : undefined}
                      aria-pressed={isSelected}
                      className={
                        isSelected
                          ? "concept-c-insight-flow__answer concept-c-insight-flow__answer--selected"
                          : "concept-c-insight-flow__answer"
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
                      <span className="concept-c-insight-flow__answer-mark" aria-hidden="true" />
                      <span>{option.label}</span>
                    </button>
                  );
                  })}
                </div>
              </>
            )}

            {selectionFeedback ? (
              <p aria-live="polite" className="concept-c-insight-flow__error">
                {selectionFeedback}
              </p>
            ) : null}

            {showValidation ? (
              <p
                aria-live="polite"
                className="concept-c-insight-flow__error"
                id={validationId}
              >
                {validationMessage}
              </p>
            ) : null}
          </div>
        </div>

        <div className="concept-c-insight-flow__controls">
          <button className="concept-c-text-link" onClick={onBack} type="button">
            {backLabel}
          </button>
          <button
            className="concept-button concept-c-button concept-c-button--filled"
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
