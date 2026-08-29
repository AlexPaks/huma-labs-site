import { Link } from "react-router-dom";
import { ConceptASectionHeading } from "../components/ConceptASectionHeading";

type InsightQuestionPreview = {
  id: string;
  order: number;
  label: string;
};

type InsightOverviewSectionProps = {
  sectionId?: string;
  headingId?: string;
  label: string;
  title: string;
  body: string;
  questions: InsightQuestionPreview[];
  ctaLabel: string;
  ctaHref?: string;
  ctaAction?: () => void;
  variant?: "default" | "page";
  dataPrimaryState?: "intro";
};

export function InsightOverviewSection({
  sectionId,
  headingId,
  label,
  title,
  body,
  questions,
  ctaLabel,
  ctaHref,
  ctaAction,
  variant = "default",
  dataPrimaryState,
}: InsightOverviewSectionProps) {
  return (
    <section
      aria-labelledby={headingId}
      className={
        variant === "page"
          ? "concept-section concept-section--insight-page"
          : "concept-section"
      }
      data-primary-state={dataPrimaryState}
      id={sectionId}
    >
      <div
        className={
          variant === "page"
            ? "concept-container concept-insight-overview concept-insight-overview--page"
            : "concept-container concept-insight-overview"
        }
      >
        <div className="concept-insight-overview__questions">
          <ol className="concept-question-ledger">
            {questions.map((question) => (
              <li key={question.id}>
                <span className="concept-question-ledger__index">
                  {String(question.order).padStart(2, "0")}
                </span>
                <span className="concept-question-ledger__text">{question.label}</span>
              </li>
            ))}
          </ol>
        </div>

        <ConceptASectionHeading
          className="concept-insight-overview__content"
          headingId={headingId}
          label={label}
          title={title}
        >
          <p>{body}</p>
          <div className="concept-insight-overview__action">
            {ctaAction ? (
              <button className="concept-button" onClick={ctaAction} type="button">
                {ctaLabel}
              </button>
            ) : ctaHref ? (
              <Link className="concept-button" to={ctaHref}>
                {ctaLabel}
              </Link>
            ) : null}
          </div>
        </ConceptASectionHeading>
      </div>
    </section>
  );
}
