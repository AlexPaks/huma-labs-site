import { Link } from "react-router-dom";
import { ConceptCHeroArt } from "../components/ConceptCHeroArt";

type ConceptCHomeHeroSectionProps = {
  sectionId?: string;
  eyebrow: string;
  titleLines: string[];
  body: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  challengeLabel: string;
  capabilityLabel: string;
  statLabels: string[];
  onPrimaryCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
};

export function ConceptCHomeHeroSection({
  sectionId,
  eyebrow,
  titleLines,
  body,
  subtitle,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  challengeLabel,
  capabilityLabel,
  statLabels,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
}: ConceptCHomeHeroSectionProps) {
  return (
    <section className="concept-section concept-c-hero" id={sectionId}>
      <div className="concept-container concept-c-hero__layout">
        <div className="concept-c-hero__visual" aria-hidden="true">
          <ConceptCHeroArt />
          <span className="concept-c-hero__thread-label concept-c-hero__thread-label--top">
            {challengeLabel}
          </span>
          <span className="concept-c-hero__thread-label concept-c-hero__thread-label--bottom">
            {capabilityLabel}
          </span>
        </div>

        <div className="concept-c-hero__copy">
          <p className="concept-kicker">{eyebrow}</p>
          <h1 className="concept-c-hero__title">
            {titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="concept-c-hero__body">{body}</p>
          <p className="concept-c-hero__subtitle">{subtitle}</p>

          <div className="concept-c-hero__actions">
            <Link
              className="concept-button concept-c-button concept-c-button--filled"
              onClick={onPrimaryCtaClick}
              to={primaryCtaHref}
            >
              {primaryCtaLabel}
            </Link>
            <Link
              className="concept-button concept-c-button concept-c-button--insight"
              onClick={onSecondaryCtaClick}
              to={secondaryCtaHref}
            >
              {secondaryCtaLabel}
            </Link>
          </div>

          <ul className="concept-c-hero__stats" aria-label={capabilityLabel}>
            {statLabels.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
