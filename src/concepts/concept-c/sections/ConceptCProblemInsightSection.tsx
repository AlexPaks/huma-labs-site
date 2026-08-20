import { Link } from "react-router-dom";
import { ConceptCCoiledThread } from "../components/ConceptCCoiledThread";

type ConceptCProblemInsightSectionProps = {
  sectionId?: string;
  contextLabel: string;
  contextTitle: string;
  contextBody: string[];
  changeItems: string[];
  challengeLines: string[];
  insightLabel: string;
  insightTitle: string;
  insightBody: string;
  questions: Array<{
    id: string;
    order: number;
    label: string;
  }>;
  ctaLabel: string;
  ctaHref: string;
};

export function ConceptCProblemInsightSection({
  sectionId,
  contextLabel,
  contextTitle,
  contextBody,
  changeItems,
  challengeLines,
  insightLabel,
  insightTitle,
  insightBody,
  questions,
  ctaLabel,
  ctaHref,
}: ConceptCProblemInsightSectionProps) {
  return (
    <section className="concept-section concept-c-problem-insight" id={sectionId}>
      <div className="concept-container concept-c-problem-insight__layout">
        <div className="concept-c-problem-insight__context">
          <p className="concept-kicker">{contextLabel}</p>
          <h2 className="concept-c-problem-insight__title">{contextTitle}</h2>
          <div className="concept-c-problem-insight__body">
            {contextBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="concept-c-problem-insight__detail">
          <ConceptCCoiledThread />

          <ul className="concept-c-problem-insight__change-list">
            {changeItems.map((item) => (
              <li key={item}>
                <p>{item}</p>
              </li>
            ))}
          </ul>

          <div className="concept-c-problem-insight__challenge">
            {challengeLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <div className="concept-c-problem-insight__insight" id="organizational-insight">
          <p className="concept-kicker">{insightLabel}</p>
          <h3 className="concept-c-problem-insight__insight-title">{insightTitle}</h3>
          <p className="concept-c-problem-insight__insight-body">{insightBody}</p>

          <ol className="concept-c-problem-insight__questions">
            {questions.map((question) => (
              <li key={question.id}>
                <span>{String(question.order).padStart(2, "0")}</span>
                <p>{question.label}</p>
              </li>
            ))}
          </ol>

          <Link className="concept-button concept-c-button concept-c-button--outline" to={ctaHref}>
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
