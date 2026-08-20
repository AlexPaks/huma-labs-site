type ChallengeItem = {
  id: string;
  statement: string;
  direction: string;
};

type ConceptCChallengesFormatsSectionProps = {
  sectionId?: string;
  label: string;
  title: string;
  body: string;
  directionLabel: string;
  formatsLabel: string;
  formatsTitle: string;
  challenges: ChallengeItem[];
  formats: string[];
};

export function ConceptCChallengesFormatsSection({
  sectionId,
  label,
  title,
  body,
  directionLabel,
  formatsLabel,
  formatsTitle,
  challenges,
  formats,
}: ConceptCChallengesFormatsSectionProps) {
  return (
    <section className="concept-section concept-c-challenges" id={sectionId}>
      <div className="concept-container concept-c-challenges__layout">
        <div className="concept-c-challenges__heading">
          <p className="concept-kicker">{label}</p>
          <h2 className="concept-c-challenges__title">{title}</h2>
          <p className="concept-c-challenges__body">{body}</p>
        </div>

        <div className="concept-c-challenges__grid">
          <div className="concept-c-challenges__column">
            <h3>{label}</h3>
            <ol className="concept-c-challenges__list">
              {challenges.map((challenge, index) => (
                <li key={challenge.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{challenge.statement}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="concept-c-challenges__column concept-c-challenges__column--center">
            <h3>{directionLabel}</h3>
            <div className="concept-c-challenges__directions">
              {challenges.map((challenge) => (
                <article key={challenge.id}>
                  <p>{challenge.direction}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="concept-c-challenges__column">
            <h3>{formatsLabel}</h3>
            <ul className="concept-c-challenges__formats">
              {formats.map((format) => (
                <li key={format}>{format}</li>
              ))}
            </ul>
            <p className="concept-c-challenges__formats-summary">{formatsTitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
