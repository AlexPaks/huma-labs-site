import { useRef, useState, type KeyboardEvent } from "react";

export type MethodTimelineStep = {
  id: string;
  label: string;
  title: string;
  description: string;
  detail?: string;
  emphasis?: string;
};

type ConceptDMethodTimelineSectionProps = {
  sectionId?: string;
  title: string;
  steps: MethodTimelineStep[];
};

export function ConceptDMethodTimelineSection({
  sectionId,
  title,
  steps,
}: ConceptDMethodTimelineSectionProps) {
  const [activeStepId, setActiveStepId] = useState(steps[0]?.id ?? "");
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeStep = steps.find((step) => step.id === activeStepId) ?? steps[0];

  function selectStep(index: number, moveFocus = false) {
    const nextIndex = (index + steps.length) % steps.length;
    setActiveStepId(steps[nextIndex].id);

    if (moveFocus) {
      nodeRefs.current[nextIndex]?.focus();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const isRtl = document.documentElement.dir === "rtl";
    const forwardKey = isRtl ? "ArrowLeft" : "ArrowRight";
    const backwardKey = isRtl ? "ArrowRight" : "ArrowLeft";

    if (event.key === forwardKey || event.key === "ArrowDown") {
      event.preventDefault();
      selectStep(index + 1, true);
      return;
    }

    if (event.key === backwardKey || event.key === "ArrowUp") {
      event.preventDefault();
      selectStep(index - 1, true);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      selectStep(0, true);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      selectStep(steps.length - 1, true);
    }
  }

  if (!activeStep) {
    return null;
  }

  return (
    <section className="concept-section concept-d-method-timeline" id={sectionId}>
      <div className="concept-container concept-d-method-timeline__inner">
        <h2 className="concept-d-method-timeline__title">{title}</h2>

        <div className="concept-d-method-timeline__body">
          <article
            aria-live="polite"
            className="concept-d-method-timeline__detail"
            id={`${sectionId ?? "method-timeline"}-detail`}
            role="tabpanel"
          >
            <p className="concept-d-method-timeline__detail-label">{activeStep.label}</p>
            <h3>{activeStep.title}</h3>
            <p>{activeStep.description}</p>
            {activeStep.detail ? <p>{activeStep.detail}</p> : null}
            {activeStep.emphasis ? (
              <p className="concept-d-method-timeline__detail-emphasis">
                <strong>{activeStep.emphasis}</strong>
              </p>
            ) : null}
          </article>

          <div aria-label={title} className="concept-d-method-timeline__rail" role="tablist">
            {steps.map((step, index) => {
              const isActive = step.id === activeStep.id;

              return (
                <button
                  key={step.id}
                  aria-controls={`${sectionId ?? "method-timeline"}-detail`}
                  aria-selected={isActive}
                  className={
                    isActive
                      ? "concept-d-method-timeline__node concept-d-method-timeline__node--active"
                      : "concept-d-method-timeline__node"
                  }
                  onClick={() => selectStep(index)}
                  onFocus={() => selectStep(index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  onPointerEnter={() => selectStep(index)}
                  ref={(element) => {
                    nodeRefs.current[index] = element;
                  }}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                >
                  <span aria-hidden="true" className="concept-d-method-timeline__node-dot" />
                  <span className="concept-d-method-timeline__node-label">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
