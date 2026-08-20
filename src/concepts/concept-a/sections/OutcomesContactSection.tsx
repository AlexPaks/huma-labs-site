import { ContactForm } from "../../../components/ContactForm";
import type { FormId } from "../../../shared/forms/formCatalog";

type OutcomeItem = {
  id: string;
  label: string;
  title: string;
};

type OutcomesContactSectionProps = {
  sectionId?: string;
  headingId?: string;
  contactSectionId?: string;
  label: string;
  title: string;
  outcomes: OutcomeItem[];
  contactLabel: string;
  contactTitle: string;
  contactBody: string;
  formId: FormId;
};

export function OutcomesContactSection({
  sectionId,
  headingId,
  contactSectionId = "contact",
  label,
  title,
  outcomes,
  contactLabel,
  contactTitle,
  contactBody,
  formId,
}: OutcomesContactSectionProps) {
  return (
    <section
      aria-labelledby={headingId}
      className="concept-section"
      id={sectionId}
    >
      <div className="concept-container concept-outcomes">
        <div className="concept-outcomes__band">
          <p className="concept-kicker">{label}</p>
          <h2 className="concept-outcomes__title" id={headingId}>{title}</h2>
          <div className="concept-outcomes__grid">
            {outcomes.map((outcome, index) => (
              <article key={outcome.id} className="concept-outcomes__item">
                <p className="concept-outcomes__item-label">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{outcome.label}</span>
                </p>
                <p className="concept-outcomes__item-title">{outcome.title}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="concept-contact" id={contactSectionId}>
          <div className="concept-contact__form">
            <ContactForm formId={formId} />
          </div>

          <div className="concept-contact__content">
            <p className="concept-kicker">{contactLabel}</p>
            <h3 className="concept-contact__title">{contactTitle}</h3>
            <p className="concept-contact__body">{contactBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
