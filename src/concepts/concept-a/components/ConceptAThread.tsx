type ThreadDot = {
  cx: number;
  cy: number;
  r?: number;
  filled?: boolean;
};

type ConceptAThreadProps = {
  className?: string;
  viewBox: string;
  path: string;
  dots?: ThreadDot[];
};

export function ConceptAThread({
  className,
  viewBox,
  path,
  dots = [],
}: ConceptAThreadProps) {
  return (
    <svg
      aria-hidden="true"
      className={["concept-thread", className].filter(Boolean).join(" ")}
      preserveAspectRatio="none"
      viewBox={viewBox}
    >
      <path
        d={path}
        vectorEffect="non-scaling-stroke"
      />
      {dots.map((dot, index) => (
        <circle
          key={`${dot.cx}-${dot.cy}-${index}`}
          cx={dot.cx}
          cy={dot.cy}
          r={dot.r ?? 5}
          className={dot.filled ? "concept-thread__dot concept-thread__dot--filled" : "concept-thread__dot"}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
