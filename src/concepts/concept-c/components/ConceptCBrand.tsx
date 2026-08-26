type ConceptCBrandProps = {
  siteName: string;
  tagline: string;
  className?: string;
};

export function ConceptCBrand({ siteName, tagline, className }: ConceptCBrandProps) {
  const [primary, ...rest] = siteName.split(" ");
  const secondary = rest.join(" ");

  return (
    <span className={["concept-c-brand", className].filter(Boolean).join(" ")}>
      <span className="concept-c-brand__name" dir="ltr">
        <span className="concept-c-brand__primary">{primary}</span>
        {secondary ? (
          <span className="concept-c-brand__secondary">{secondary}</span>
        ) : null}
      </span>
      <span className="concept-c-brand__tagline" dir="auto">{tagline}</span>
    </span>
  );
}
