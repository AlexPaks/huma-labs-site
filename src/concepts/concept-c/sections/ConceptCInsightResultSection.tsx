import { ContactForm } from "../../../components/ContactForm";
import type { FormId } from "../../../shared/forms/formCatalog";

type ConceptCInsightResultSectionProps = {
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
  dataPrimaryState?: "result";
  restartLabel?: string;
  onRestart?: () => void;
  insightContext?: {
    primaryCapability: string;
    secondaryCapabilities: string[];
  };
};

export function ConceptCInsightResultSection({
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
  dataPrimaryState,
  restartLabel,
  onRestart,
  insightContext,
}: ConceptCInsightResultSectionProps) {
  return (
    <section
      className="concept-section concept-section--insight-page concept-c-result"
      data-primary-state={dataPrimaryState}
      id={sectionId ?? "insight-result"}
    >
      <div className="concept-container concept-c-result__layout">
        <div className="concept-c-result__summary">
          <p className="concept-kicker">{eyebrow}</p>
          <h2 className="concept-c-result__capability">{capability}</h2>
          {onRestart && restartLabel ? (
            <button className="concept-c-text-link concept-c-result__restart" onClick={onRestart} type="button">
              {restartLabel}
            </button>
          ) : null}

          <div className="concept-c-result__content">
            <div className="concept-c-result__focus">
              <h3>{focusTitle}</h3>
              <ul>
                {focusItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="concept-c-result__directions">
              <h3>{directionTitle}</h3>
              <div className="concept-c-result__direction-grid">
                {process.map((step) => (
                  <article key={step.id}>
                    <p>{step.label}</p>
                    <h4>{step.title}</h4>
                    {step.description ? <p>{step.description}</p> : null}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="concept-c-result__contact">
          <div className="concept-c-result__contact-copy">
            <p className="concept-kicker">{contactLabel}</p>
            <h3>{contactTitle}</h3>
          </div>
          <div className="concept-c-result__form">
            <ContactForm
              compact
              extraFields={insightContext ? { insightContext } : undefined}
              formId={formId}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
