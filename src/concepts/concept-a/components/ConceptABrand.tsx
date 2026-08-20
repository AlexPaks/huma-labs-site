type ConceptABrandProps = {
  siteName: string;
  className?: string;
};

export function ConceptABrand({ siteName, className }: ConceptABrandProps) {
  const [primary, ...rest] = siteName.split(" ");
  const secondary = rest.join(" ");

  return (
    <span className={["concept-brand", className].filter(Boolean).join(" ")}>
      <span className="concept-brand__primary">{primary}</span>
      {secondary ? (
        <span className="concept-brand__secondary">{secondary}</span>
      ) : null}
    </span>
  );
}
