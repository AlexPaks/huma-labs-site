import { ContactForm } from "../../../components/ContactForm";
import type { FormId } from "../../../shared/forms/formCatalog";

type OutcomeItem = {
  id: string;
  label: string;
  title: string;
};

type ConceptCOutcomesContactSectionProps = {
  sectionId?: string;
  label: string;
  title: string;
  outcomes: OutcomeItem[];
  contactLabel: string;
  contactTitle: string;
  contactBody: string;
  formId: FormId;
  contactSectionId?: string;
};

export function ConceptCOutcomesContactSection({
  sectionId,
  label,
  title,
  outcomes,
  contactLabel,
  contactTitle,
  contactBody,
  formId,
  contactSectionId = "contact",
}: ConceptCOutcomesContactSectionProps) {
  return (
    <section className="concept-section concept-c-outcomes" id={sectionId}>
      <div className="concept-container concept-c-outcomes__layout">
        <div className="concept-c-outcomes__summary">
          <p className="concept-kicker">{label}</p>
          <h2 className="concept-c-outcomes__title">{title}</h2>
          <ul className="concept-c-outcomes__list">
            {outcomes.map((outcome) => (
              <li key={outcome.id}>
                <h3>{outcome.label}</h3>
                <p>{outcome.title}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="concept-c-outcomes__contact" id={contactSectionId}>
          <div className="concept-c-outcomes__contact-copy">
            <p className="concept-kicker">{contactLabel}</p>
            <h3>{contactTitle}</h3>
            <p>{contactBody}</p>
          </div>
          <div className="concept-c-outcomes__form">
            <ContactForm formId={formId} />
          </div>
        </div>
      </div>
    </section>
  );
}
