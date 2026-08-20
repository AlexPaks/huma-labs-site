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
  outcome: string;
};

type ConceptCCapabilitiesMethodSectionProps = {
  sectionId?: string;
  label: string;
  title: string;
  body: string;
  capabilitiesLabel: string;
  methodLabel: string;
  outcomesLabel: string;
  capabilities: CapabilityItem[];
  process: ProcessItem[];
};

export function ConceptCCapabilitiesMethodSection({
  sectionId,
  label,
  title,
  body,
  capabilitiesLabel,
  methodLabel,
  outcomesLabel,
  capabilities,
  process,
}: ConceptCCapabilitiesMethodSectionProps) {
  return (
    <section className="concept-section concept-c-capabilities" id={sectionId}>
      <div className="concept-container concept-c-capabilities__layout">
        <div className="concept-c-capabilities__heading">
          <p className="concept-kicker">{label}</p>
          <h2 className="concept-c-capabilities__title">{title}</h2>
          <p className="concept-c-capabilities__body">{body}</p>
        </div>

        <div className="concept-c-capabilities__diagram">
          <div className="concept-c-capabilities__column concept-c-capabilities__column--capabilities">
            <p className="concept-c-capabilities__column-label">{capabilitiesLabel}</p>
            {capabilities.map((capability) => (
              <article key={capability.id} className="concept-c-capabilities__capability">
                <h3>{capability.label}</h3>
                <p>{capability.description}</p>
              </article>
            ))}
          </div>

          <div className="concept-c-capabilities__column concept-c-capabilities__column--method">
            <p className="concept-c-capabilities__column-label">{methodLabel}</p>
            <div className="concept-c-capabilities__process">
              {process.map((step, index) => (
                <div key={step.id} className="concept-c-capabilities__process-item">
                  <article className="concept-c-capabilities__process-step">
                    <span className="concept-c-capabilities__process-node" aria-hidden="true" />
                    <p>{step.label}</p>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                  {index < process.length - 1 && (
                    <svg
                      aria-hidden="true"
                      className="concept-c-capabilities__process-arrow"
                      viewBox="0 0 10 10"
                    >
                      <polyline points="2,1 8,5 2,9" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="concept-c-capabilities__column concept-c-capabilities__column--outcomes">
            <p className="concept-c-capabilities__column-label">{outcomesLabel}</p>
            <ul className="concept-c-capabilities__outcomes">
              {process.map((step) => (
                <li key={step.id}>
                  <span>{step.label}</span>
                  <p>{step.outcome}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
