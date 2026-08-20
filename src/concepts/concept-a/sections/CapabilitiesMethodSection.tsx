import { ConceptAThread } from "../components/ConceptAThread";

type CapabilityItem = {
  id: string;
  label: string;
  title: string;
  description: string;
};

type ProcessItem = {
  id: string;
  label: string;
  title: string;
  description: string;
};

type CapabilitiesMethodSectionProps = {
  sectionId?: string;
  headingId?: string;
  processSectionId?: string;
  processLabel: string;
  label: string;
  title: string;
  body: string;
  capabilities: CapabilityItem[];
  process: ProcessItem[];
};

export function CapabilitiesMethodSection({
  sectionId,
  headingId,
  processSectionId,
  processLabel,
  label,
  title,
  body,
  capabilities,
  process,
}: CapabilitiesMethodSectionProps) {
  return (
    <section
      aria-labelledby={headingId}
      className="concept-section"
      id={sectionId}
    >
      <div className="concept-container concept-capabilities">
        <div className="concept-capabilities__heading">
          <p className="concept-kicker">{label}</p>
          <h2 className="concept-display" id={headingId}>{title}</h2>
        </div>

        <div className="concept-capabilities__grid">
          {capabilities.map((capability, index) => (
            <article key={capability.id} className="concept-capabilities__item">
              <p className="concept-capabilities__item-label">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{capability.label}</span>
              </p>
              <h3 className="concept-capabilities__item-title">{capability.title}</h3>
              <p className="concept-capabilities__item-body">{capability.description}</p>
            </article>
          ))}
        </div>

        <ConceptAThread
          className="concept-capabilities__thread"
          dots={[
            { cx: 18, cy: 42, r: 5, filled: true },
            { cx: 520, cy: 120, r: 9 },
            { cx: 1018, cy: 248, r: 5, filled: true },
          ]}
          path="M18 42 C18 120 180 94 290 94 C388 94 422 120 520 120 C624 120 670 66 776 66 C912 66 1018 126 1018 248"
          viewBox="0 0 1040 280"
        />

        <div
          aria-label={processLabel}
          className="concept-capabilities__process"
          id={processSectionId}
        >
          <div className="concept-capabilities__process-steps">
            {process.map((step) => (
              <article key={step.id} className="concept-capabilities__process-step">
                <h3 className="concept-capabilities__process-label">{step.label}</h3>
                <p>{step.title}</p>
                <p>{step.description}</p>
              </article>
            ))}
          </div>

          <div className="concept-capabilities__process-summary">
            <p>{body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
