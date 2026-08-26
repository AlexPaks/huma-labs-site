type ConceptABrandProps = {
  siteName: string;
  tagline: string;
  className?: string;
};

export function ConceptABrand({ siteName, tagline, className }: ConceptABrandProps) {
  const [primary, ...rest] = siteName.split(" ");
  const secondary = rest.join(" ");

  return (
    <span className={["concept-brand", className].filter(Boolean).join(" ")}>
      <span className="concept-brand__name" dir="ltr">
        <span className="concept-brand__primary">{primary}</span>
        {secondary ? (
          <span className="concept-brand__secondary">{secondary}</span>
        ) : null}
      </span>
      <span className="concept-brand__tagline" dir="auto">{tagline}</span>
    </span>
  );
}
