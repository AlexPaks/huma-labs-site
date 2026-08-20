import { Link } from "react-router-dom";

type InsightQuestionPreview = {
  id: string;
  order: number;
  label: string;
};

type ConceptCInsightOverviewSectionProps = {
  sectionId?: string;
  label: string;
  title: string;
  body: string;
  questions: InsightQuestionPreview[];
  ctaLabel: string;
  ctaHref?: string;
  ctaAction?: () => void;
  dataPrimaryState?: "intro";
};

export function ConceptCInsightOverviewSection({
  sectionId,
  label,
  title,
  body,
  questions,
  ctaLabel,
  ctaHref,
  ctaAction,
  dataPrimaryState,
}: ConceptCInsightOverviewSectionProps) {
  return (
    <section
      className="concept-section concept-section--insight-page concept-c-insight-overview"
      data-primary-state={dataPrimaryState}
      id={sectionId}
    >
      <div className="concept-container concept-c-insight-overview__layout">
        <aside className="concept-c-insight-overview__questions">
          <ol>
            {questions.map((question) => (
              <li key={question.id}>
                <span>{String(question.order).padStart(2, "0")}</span>
                <p>{question.label}</p>
              </li>
            ))}
          </ol>
        </aside>

        <div className="concept-c-insight-overview__content">
          <p className="concept-kicker">{label}</p>
          <h1 className="concept-c-insight-overview__title">{title}</h1>
          <p className="concept-c-insight-overview__body">{body}</p>
          {ctaAction ? (
            <button
              className="concept-button concept-c-button concept-c-button--filled"
              onClick={ctaAction}
              type="button"
            >
              {ctaLabel}
            </button>
          ) : ctaHref ? (
            <Link className="concept-button concept-c-button concept-c-button--filled" to={ctaHref}>
              {ctaLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
