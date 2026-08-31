import { ContactForm } from "../../../components/ContactForm";
import { ConceptASectionHeading } from "../components/ConceptASectionHeading";
import type { FormId } from "../../../shared/forms/formCatalog";

export type ProgramFitStep = {
  id: "strategicNeeds" | "personalAdaptation" | "organizationalSolution";
  number: string;
  title: string;
  description: string;
  imageAlt: string;
  imageSrc: string;
};

type ConceptDProgramFitSectionProps = {
  sectionId: string;
  outcomesSectionId: string;
  contactSectionId: string;
  title: string;
  intro: string;
  steps: ProgramFitStep[];
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
  intro,
  steps,
  contactLabel,
  contactTitle,
  contactBody,
  formId,
}: ConceptDProgramFitSectionProps) {
  return (
    <>
      <section aria-labelledby={`${sectionId}-heading`} className="concept-section" id={sectionId}>
        <div className="concept-container concept-d-program-fit">
          <ConceptASectionHeading
            align="center"
            className="concept-d-program-fit__heading"
            headingId={`${sectionId}-heading`}
            title={title}
          >
            <p>{intro}</p>
          </ConceptASectionHeading>

          <ol className="concept-d-program-fit__steps">
            {steps.map((step) => (
              <li className="concept-d-program-fit__step" key={step.id}>
                <article className="concept-d-program-fit__card" tabIndex={0}>
                  <div className="concept-d-program-fit__image-wrap">
                    <img alt={step.imageAlt} src={step.imageSrc} />
                  </div>
                  <div className="concept-d-program-fit__card-content">
                    <p className="concept-d-program-fit__number">{step.number}</p>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
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
