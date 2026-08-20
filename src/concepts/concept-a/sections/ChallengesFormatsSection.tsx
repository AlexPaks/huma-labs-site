type ChallengeItem = {
  id: string;
  statement: string;
  direction: string;
};

type ChallengesFormatsSectionProps = {
  sectionId?: string;
  headingId?: string;
  formatsSectionId?: string;
  label: string;
  title: string;
  body: string;
  directionLabel: string;
  challenges: ChallengeItem[];
  formatsLabel: string;
  formatsTitle: string;
  formats: string[];
};

export function ChallengesFormatsSection({
  sectionId,
  headingId,
  formatsSectionId,
  label,
  title,
  body,
  directionLabel,
  challenges,
  formatsLabel,
  formatsTitle,
  formats,
}: ChallengesFormatsSectionProps) {
  return (
    <section
      aria-labelledby={headingId}
      className="concept-section"
      id={sectionId}
    >
      <div className="concept-container concept-challenges">
        <div className="concept-challenges__top">
          <div className="concept-challenges__headline">
            <p className="concept-kicker">{label}</p>
            <h2 className="concept-display" id={headingId}>{title}</h2>
          </div>

          <div className="concept-challenges__statements">
            {challenges.map((challenge) => (
              <p key={challenge.id}>{challenge.statement}</p>
            ))}
          </div>
        </div>

        <p className="concept-challenges__body">{body}</p>

        <div className="concept-challenges__bottom">
          <div className="concept-challenges__directions">
            <h3 className="concept-kicker">{directionLabel}</h3>
            <ol className="concept-numbered-directions">
              {challenges.map((challenge, index) => (
                <li key={challenge.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{challenge.direction}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="concept-challenges__formats" id={formatsSectionId}>
            <h3 className="concept-kicker">{formatsLabel}</h3>
            <div className="concept-challenges__formats-grid">
              {formats.map((format) => (
                <span key={format}>{format}</span>
              ))}
            </div>
            <p className="concept-challenges__formats-summary">{formatsTitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
