export interface Segment {
  label: string;
  value: number;
  color: string;
}

/** Segmented horizontal meter with an always-visible legend. */
export default function Meter({
  title,
  segments,
}: {
  title: string;
  segments: Segment[];
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <h3 className="mb-3 text-sm font-bold tracking-tight text-slate-700 dark:text-slate-200">
        {title}
      </h3>
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        {segments
          .filter((s) => s.value > 0)
          .map((s) => (
            <div
              key={s.label}
              className="h-full rounded-full"
              style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }}
              title={`${s.label}: ${s.value}`}
            />
          ))}
      </div>
      <ul className="mt-3 space-y-1.5">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              {s.label}
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
