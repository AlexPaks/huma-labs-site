type IsoBlockProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  accent?: boolean;
};

function IsoBlock({ x, y, w, h, accent = false }: IsoBlockProps) {
  const halfW = w / 2;
  const quarterW = w / 4;
  const top = `${x},${y} ${x + halfW},${y - quarterW} ${x + w},${y} ${x + halfW},${y + quarterW}`;
  const left = `${x},${y} ${x + halfW},${y + quarterW} ${x + halfW},${y + quarterW + h} ${x},${y + h}`;
  const right = `${x + halfW},${y + quarterW} ${x + w},${y} ${x + w},${y + h} ${x + halfW},${y + quarterW + h}`;
  const prefix = accent ? "concept-c-hero__iso-accent" : "concept-c-hero__iso-block";

  return (
    <g>
      <polygon className={`${prefix}-left`} points={left} />
      <polygon className={`${prefix}-right`} points={right} />
      <polygon className={`${prefix}-top`} points={top} />
    </g>
  );
}

export function ConceptCHeroArt() {
  return (
    <svg
      aria-hidden="true"
      className="concept-c-hero__art"
      viewBox="0 0 420 460"
      preserveAspectRatio="xMidYMid meet"
    >
      <IsoBlock h={220} w={70} x={30} y={90} />
      <IsoBlock h={150} w={90} x={90} y={150} />
      <IsoBlock h={80} w={130} x={20} y={230} />
      <IsoBlock h={45} w={70} x={150} y={260} />
      <IsoBlock accent h={42} w={48} x={205} y={300} />

      <path
        className="concept-c-hero__art-thread"
        d="M 30 60 C 4 128, 56 176, 38 228 C 24 270, 118 266, 150 298 C 178 316, 214 302, 229 321 C 248 344, 300 368, 372 412"
        fill="none"
      />
      <circle className="concept-c-hero__art-node" cx="30" cy="60" r="7" />
      <circle className="concept-c-hero__art-node concept-c-hero__art-node--accent" cx="229" cy="321" r="7" />
    </svg>
  );
}
