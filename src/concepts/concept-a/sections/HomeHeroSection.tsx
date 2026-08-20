import { Link } from "react-router-dom";
import { ConceptAThread } from "../components/ConceptAThread";

type HomeHeroSectionProps = {
  sectionId?: string;
  leadLabel: string;
  changeItems: string[];
  challengeLines: string[];
  titleLines: string[];
  body: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  previewLabel: string;
  previewTitle: string;
  onPrimaryCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
};

export function HomeHeroSection({
  sectionId,
  leadLabel,
  changeItems,
  challengeLines,
  titleLines,
  body,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  previewLabel,
  previewTitle,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
}: HomeHeroSectionProps) {
  return (
    <section className="concept-section concept-hero" id={sectionId}>
      <div className="concept-container">
        <div className="concept-hero__grid">
          <aside className="concept-hero__ledger">
            <div className="concept-hero__change-cluster">
              <p className="concept-kicker">{leadLabel}</p>
              <ul className="concept-hero__change-list">
                {changeItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="concept-hero__challenge-lines">
              {challengeLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </aside>

          <div className="concept-hero__content">
            <h1 className="concept-hero__title">
              {titleLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p className="concept-hero__body">{body}</p>
            <div className="concept-hero__actions">
              <Link className="concept-button" onClick={onPrimaryCtaClick} to={primaryCtaHref}>
                {primaryCtaLabel}
              </Link>
              <Link className="concept-text-link" onClick={onSecondaryCtaClick} to={secondaryCtaHref}>
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

        <div className="concept-hero__preview">
          <div className="concept-hero__preview-rule" />
          <p className="concept-kicker">{previewLabel}</p>
          <h2 className="concept-hero__preview-title">{previewTitle}</h2>
        </div>
      </div>
    </section>
  );
}
