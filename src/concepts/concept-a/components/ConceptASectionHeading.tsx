import type { ReactNode } from "react";

type ConceptASectionHeadingProps = {
  label?: string;
  title: string;
  children?: ReactNode;
  align?: "start" | "center";
  className?: string;
  headingId?: string;
};

export function ConceptASectionHeading({
  label,
  title,
  children,
  align = "start",
  className,
  headingId,
}: ConceptASectionHeadingProps) {
  return (
    <div
      className={[
        "concept-section-heading",
        `concept-section-heading--${align}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label ? <p className="concept-kicker">{label}</p> : null}
      <h2 className="concept-display" id={headingId}>{title}</h2>
      {children ? <div className="concept-section-heading__body">{children}</div> : null}
    </div>
  );
}
