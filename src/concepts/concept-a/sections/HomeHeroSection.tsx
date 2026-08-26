import { Link } from "react-router-dom";
import { ConceptAThread } from "../components/ConceptAThread";

type HomeHeroSectionProps = {
  sectionId?: string;
  ledgerEyebrow: string;
  ledgerTitle: string;
  ledgerBody: string;
  ledgerQuestionLead: string;
  ledgerQuestion: string;
  ledgerConclusionLead: string;
  ledgerConclusion: string;
  titleLines: string[];
  body: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  onPrimaryCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
};

export function HomeHeroSection({
  sectionId,
  ledgerEyebrow,
  ledgerTitle,
  ledgerBody,
  ledgerQuestionLead,
  ledgerQuestion,
  ledgerConclusionLead,
  ledgerConclusion,
  titleLines,
  body,
  subtitle,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
}: HomeHeroSectionProps) {
  return (
    <section className="concept-section concept-hero" id={sectionId}>
      <div className="concept-container">
        <div className="concept-hero__grid">
          <aside className="concept-hero__ledger">
            <div aria-hidden="true" className="concept-hero__ledger-image" />
            <div className="concept-hero__ledger-copy">
              <p className="concept-kicker">{ledgerEyebrow}</p>
              <h2 className="concept-hero__ledger-title">{ledgerTitle}</h2>
              <p className="concept-hero__ledger-body">{ledgerBody}</p>
              <p className="concept-hero__ledger-question">
                <strong>{ledgerQuestionLead}</strong>
                <br />
                <strong>{ledgerQuestion}</strong>
              </p>
              <p className="concept-hero__ledger-conclusion">
                {ledgerConclusionLead}
                <br />
                <strong>{ledgerConclusion}</strong>
              </p>
            </div>
          </aside>

          <div className="concept-hero__content">
            <h1 className="concept-hero__title">
              {titleLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p className="concept-hero__body">{body}</p>
            <p className="concept-hero__subtitle">{subtitle}</p>
            <div className="concept-hero__actions">
              <Link className="concept-button" onClick={onPrimaryCtaClick} to={primaryCtaHref}>
                {primaryCtaLabel}
              </Link>
              <Link className="concept-button concept-button--insight" onClick={onSecondaryCtaClick} to={secondaryCtaHref}>
                {secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <ConceptAThread
            className="concept-hero__thread"
            dots={[
              { cx: 84, cy: 28, r: 7, filled: true },
              { cx: 362, cy: 74, r: 7 },
              { cx: 864, cy: 114, r: 6, filled: true },
            ]}
            path="M84 28 C126 28 154 28 192 28 C244 28 278 44 316 74 C356 106 430 114 540 114 L864 114"
            viewBox="0 0 920 156"
          />
        </div>
      </div>
    </section>
  );
}
