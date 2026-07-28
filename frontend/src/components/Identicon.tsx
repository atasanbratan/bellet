import { cn } from '../lib/cn';
import { GRID, identicon } from '../lib/identicon';

/**
 * Pixel avatar for a user. Drawn as SVG rects so it stays crisp at any size
 * and needs no image request. `value` should be a stable id, not a name —
 * names are optional here and can change.
 */
export default function Identicon({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const { cells, ink } = identicon(value);

  return (
    <svg
      // One cell of padding all round, so the grid reads as pixel art instead
      // of bleeding into the tile's edge.
      viewBox={`-1 -1 ${GRID + 2} ${GRID + 2}`}
      className={cn(
        // Square, not a circle: rounding a 5×5 grid away clips the corner
        // pixels and the pattern stops looking pixelated at all.
        'overflow-hidden rounded bg-slate-100 dark:bg-slate-800',
        className,
      )}
      // Keep the blocks hard-edged when the SVG is scaled up.
      shapeRendering="crispEdges"
      aria-hidden
    >
      {cells.map((on, i) =>
        on ? (
          <rect
            key={i}
            x={i % GRID}
            y={Math.floor(i / GRID)}
            width="1"
            height="1"
            fill={ink}
          />
        ) : null,
      )}
    </svg>
  );
}
