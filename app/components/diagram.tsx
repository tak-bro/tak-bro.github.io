import { createContext, use, useId, type ReactNode } from 'react';

/**
 * Box-and-arrow diagrams drawn as one static SVG. Colour comes only from the fumadocs and brand
 * tokens (Tailwind `fill-*`/`stroke-*`), so dark mode follows the page. SVG text does not wrap:
 * a long label is given as `lines`, and the QA check measures every label against its box.
 */

/** Font sizes in viewBox units. Diagrams are at most 400 wide, so on a 320px phone they scale by
 * about 0.7 and these stay at 11px and up. */
const LABEL = 16;
const SUB = 14;
const LINE_GAP = 4;

type Tone = 'default' | 'brand' | 'muted';

const BOX_TONE: Record<Tone, string> = {
  default: 'fill-fd-card stroke-fd-border',
  brand: 'fill-fd-background stroke-brand',
  muted: 'fill-fd-background stroke-fd-border [stroke-dasharray:4_4]',
};

const MarkerContext = createContext('');

export interface DiagramProps {
  /** Width and height of the viewBox. Width ≤ 400 keeps the text legible at 320px. */
  readonly width: number;
  readonly height: number;
  /** The accessible name, and the visible caption under the drawing. */
  readonly title: string;
  /** What the drawing says in words, for a screen reader: the flow, not the shapes. */
  readonly description: string;
  readonly children: ReactNode;
}

export const Diagram = ({ width, height, title, description, children }: DiagramProps) => {
  const id = useId();
  const marker = `${id}-arrow`;
  return (
    <figure data-diagram="" className="not-prose my-8 flex flex-col items-center gap-3">
      <svg
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="h-auto w-full font-sans"
        style={{ maxWidth: width }}
      >
        <title id={`${id}-title`}>{title}</title>
        <desc id={`${id}-desc`}>{description}</desc>
        <defs>
          <marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" className="fill-fd-muted-foreground" />
          </marker>
        </defs>
        <MarkerContext value={marker}>{children}</MarkerContext>
      </svg>
      <figcaption aria-hidden className="text-center text-sm text-fd-muted-foreground break-keep">
        {title}
      </figcaption>
    </figure>
  );
};

export interface BoxProps {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  /** One line, or several when the label is longer than the box. */
  readonly label: string | readonly string[];
  /** A second, muted line under the label: a path, a file. */
  readonly sub?: string;
  readonly tone?: Tone;
  /** Draw `sub` in the code face, for paths and file names. */
  readonly mono?: boolean;
}

export const Box = ({ x, y, w, h, label, sub, tone = 'default', mono = false }: BoxProps) => {
  const lines = typeof label === 'string' ? [label] : label;
  const rows = lines.length + (sub ? 1 : 0);
  const block = lines.length * LABEL + (sub ? SUB : 0) + (rows - 1) * LINE_GAP;
  // Baselines sit a little above each row's bottom; 0.8 of the size is the cap height of Pretendard.
  let top = y + (h - block) / 2;
  const baseline = (size: number) => {
    const at = top + size * 0.8;
    top += size + LINE_GAP;
    return at;
  };
  return (
    <g data-box="">
      <rect x={x} y={y} width={w} height={h} rx={6} className={`${BOX_TONE[tone]} [stroke-width:1.25]`} />
      {lines.map((line) => (
        <text key={line} x={x + w / 2} y={baseline(LABEL)} textAnchor="middle" fontSize={LABEL} fontWeight={600} className="fill-fd-foreground">
          {line}
        </text>
      ))}
      {sub ? (
        <text x={x + w / 2} y={baseline(SUB)} textAnchor="middle" fontSize={SUB} className={`fill-fd-muted-foreground ${mono ? 'font-mono' : ''}`}>
          {sub}
        </text>
      ) : null}
    </g>
  );
};

export interface ArrowProps {
  /** The path's corners, from tail to head: [x, y] pairs. */
  readonly points: readonly (readonly [number, number])[];
  readonly dashed?: boolean;
}

export const Arrow = ({ points, dashed = false }: ArrowProps) => {
  const marker = use(MarkerContext);
  return (
    <polyline
      points={points.map(([x, y]) => `${x},${y}`).join(' ')}
      fill="none"
      markerEnd={`url(#${marker})`}
      className={`stroke-fd-muted-foreground [stroke-width:1.25] ${dashed ? '[stroke-dasharray:4_4]' : ''}`}
    />
  );
};
