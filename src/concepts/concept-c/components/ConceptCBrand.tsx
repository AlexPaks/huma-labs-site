type ConceptCBrandProps = {
  siteName: string;
  className?: string;
};

export function ConceptCBrand({ siteName, className }: ConceptCBrandProps) {
  const [primary, ...rest] = siteName.split(" ");
  const secondary = rest.join(" ");

  return (
    <span className={["concept-c-brand", className].filter(Boolean).join(" ")}>
      <span className="concept-c-brand__primary">{primary}</span>
      {secondary ? (
        <span className="concept-c-brand__secondary">{secondary}</span>
      ) : null}
    </span>
  );
}
