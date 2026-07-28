export interface StatTile {
  label: string;
  value: string;
  sub?: string;
  /** Functional colour, per the design system: teal = settled, amber = waiting. */
  accent?: 'positive' | 'pending';
}

const accentCls = {
  positive: 'text-teal-600 dark:text-teal-400',
  pending: 'text-amber-600 dark:text-amber-400',
};

/** Row of aggregate tiles shown above a data table. */
export default function StatTiles({ tiles }: { tiles: StatTile[] }) {
  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-3">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
        >
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {tile.label}
          </div>
          <div
            className={`mt-1 text-2xl font-extrabold tracking-tight ${
              tile.accent ? accentCls[tile.accent] : ''
            }`}
          >
            {tile.value}
          </div>
          {tile.sub && (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {tile.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
