import { Link } from "react-router-dom";
import { ConceptAThread } from "../components/ConceptAThread";
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

        <ConceptAThread
          className="concept-insight-overview__thread"
          dots={[
            { cx: 146, cy: 24, r: 6, filled: true },
            { cx: 438, cy: 96, r: 7 },
            { cx: 846, cy: 96, r: 6, filled: true },
          ]}
          path="M146 24 C146 72 238 96 366 96 L846 96"
          viewBox="0 0 900 132"
        />
      </div>
    </section>
  );
}
