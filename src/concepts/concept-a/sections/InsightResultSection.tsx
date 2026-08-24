import { ContactForm } from "../../../components/ContactForm";
import type { FormId } from "../../../shared/forms/formCatalog";
import type { InsightResult } from "../../../shared/assessment/insightResultTypes";

type InsightResultSectionProps = {
  sectionId?: string;
  eyebrow: string;
  capability: string;
  focusTitle: string;
  focusItems: string[];
  directionTitle: string;
  process: Array<{
    id: string;
    label: string;
    title: string;
    description: string;
  }>;
  contactLabel: string;
  contactTitle: string;
  formId: FormId;
  variant?: "default" | "page";
  dataPrimaryState?: "result";
  restartLabel?: string;
  onRestart?: () => void;
  insightContext?: {
    primaryCapability: string;
    secondaryCapabilities: string[];
    insightResult?: InsightResult;
  };
};

export function InsightResultSection({
  sectionId,
  eyebrow,
  capability,
  focusTitle,
  focusItems,
  directionTitle,
  process,
  contactLabel,
  contactTitle,
  formId,
  variant = "default",
  dataPrimaryState,
  restartLabel,
  onRestart,
  insightContext,
}: InsightResultSectionProps) {
  return (
    <section
      className={
        variant === "page"
          ? "concept-section concept-section--insight-page"
          : "concept-section"
      }
      data-primary-state={dataPrimaryState}
      id={sectionId ?? "insight-result"}
    >
      <div
        className={
          variant === "page"
            ? "concept-container concept-result concept-result--page"
            : "concept-container concept-result"
        }
      >
        <div className="concept-result__summary">
          <p className="concept-kicker">{eyebrow}</p>
          <h2 className="concept-result__capability">{capability}</h2>
          {onRestart && restartLabel ? (
            <button className="concept-text-link concept-result__restart" onClick={onRestart} type="button">
              {restartLabel}
            </button>
          ) : null}

          <div className="concept-result__panel">
            <div className="concept-result__block">
              <h3>{focusTitle}</h3>
              <ul>
                {focusItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="concept-result__block">
              <h3>{directionTitle}</h3>
              <ol className="concept-result__process-list">
                {process.map((step, index) => (
                  <li key={step.id}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <p>{step.label}</p>
                      <p>{step.title}</p>
                      {step.description ? <p>{step.description}</p> : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="concept-result__contact">
          <div className="concept-result__contact-copy">
            <p className="concept-kicker">{contactLabel}</p>
            <h3 className="concept-result__contact-title">{contactTitle}</h3>
          </div>
          <ContactForm
            compact
            extraFields={insightContext ? { insightContext } : undefined}
            formId={formId}
          />
        </div>
      </div>
    </section>
  );
}
