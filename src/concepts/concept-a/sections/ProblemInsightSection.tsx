import { ConceptAThread } from "../components/ConceptAThread";
import { ConceptASectionHeading } from "../components/ConceptASectionHeading";

type ProblemInsightSectionProps = {
  sectionId?: string;
  headingId?: string;
  label: string;
  title: string;
  body: string[];
  changeItems: string[];
  challengeLines: string[];
};

export function ProblemInsightSection({
  sectionId,
  headingId,
  label,
  title,
  body,
  changeItems,
  challengeLines,
}: ProblemInsightSectionProps) {
  return (
    <section
      aria-labelledby={headingId}
      className="concept-section"
      id={sectionId}
    >
      <div className="concept-container concept-problem-insight">
        <div className="concept-problem-insight__context">
          <ol className="concept-numbered-list">
            {changeItems.map((item, index) => (
              <li key={item}>
                <span className="concept-numbered-list__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="concept-numbered-list__text">{item}</span>
              </li>
            ))}
          </ol>

          <div className="concept-problem-insight__challenge">
            {challengeLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <ConceptASectionHeading
          className="concept-problem-insight__entry"
          headingId={headingId}
          label={label}
          title={title}
        >
          {body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </ConceptASectionHeading>

        <ConceptAThread
          className="concept-problem-insight__thread"
          dots={[
            { cx: 42, cy: 22, r: 6, filled: true },
            { cx: 398, cy: 86, r: 6 },
            { cx: 822, cy: 86, r: 5, filled: true },
          ]}
          path="M42 22 C128 22 202 22 258 22 C316 22 348 86 438 86 L822 86"
          viewBox="0 0 860 120"
        />
      </div>
    </section>
  );
}
