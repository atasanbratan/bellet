import type { ReactNode } from 'react';

export default function StatTile({
  icon,
  value,
  label,
  sub,
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  sub?: string;
}) {
  return (
    <div className="card-hover rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="inline-flex rounded bg-teal-50 p-2.5 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
        {icon}
      </div>
      <div className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
        {value}
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
      {sub && <div className="mt-1 text-xs font-medium text-slate-400">{sub}</div>}
    </div>
  );
}
