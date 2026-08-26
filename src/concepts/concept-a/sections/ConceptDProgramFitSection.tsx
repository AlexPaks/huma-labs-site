import { ContactForm } from "../../../components/ContactForm";
import type { FormId } from "../../../shared/forms/formCatalog";

type ConceptDProgramFitSectionProps = {
  sectionId: string;
  outcomesSectionId: string;
  contactSectionId: string;
  title: string;
  subtitle: string;
  illustrationAlt: string;
  strategicNeedsLabel: string;
  tailoredDesignLabel: string;
  tailoredSolutionLabel: string;
  contactLabel: string;
  contactTitle: string;
  contactBody: string;
  formId: FormId;
};

export function ConceptDProgramFitSection({
  sectionId,
  outcomesSectionId,
  contactSectionId,
  title,
  subtitle,
  illustrationAlt,
  strategicNeedsLabel,
  tailoredDesignLabel,
  tailoredSolutionLabel,
  contactLabel,
  contactTitle,
  contactBody,
  formId,
}: ConceptDProgramFitSectionProps) {
  return (
    <>
      <section aria-labelledby={`${sectionId}-heading`} className="concept-section" id={sectionId}>
        <div className="concept-container concept-d-program-fit">
          <header className="concept-d-program-fit__heading">
            <h2 id={`${sectionId}-heading`}>{title}</h2>
            <p>{subtitle}</p>
          </header>

          <figure className="concept-d-program-fit__illustration">
            <img alt={illustrationAlt} src="/images/concept-d/program-fit-illustration.png" />
            <span className="concept-d-program-fit__illustration-label concept-d-program-fit__illustration-label--needs">
              {strategicNeedsLabel}
            </span>
            <span className="concept-d-program-fit__illustration-label concept-d-program-fit__illustration-label--design">
              {tailoredDesignLabel}
            </span>
            <span className="concept-d-program-fit__illustration-label concept-d-program-fit__illustration-label--solution">
              {tailoredSolutionLabel}
            </span>
          </figure>
        </div>
      </section>

      <section aria-label={title} className="concept-section concept-d-program-fit__contact-section" id={outcomesSectionId}>
        <div className="concept-container">
          <div className="concept-contact concept-d-program-fit__contact" id={contactSectionId}>
            <div className="concept-contact__content">
              <p className="concept-kicker">{contactLabel}</p>
              <h3 className="concept-contact__title">{contactTitle}</h3>
              <p className="concept-contact__body">{contactBody}</p>
            </div>

            <div className="concept-contact__form">
              <ContactForm formId={formId} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
