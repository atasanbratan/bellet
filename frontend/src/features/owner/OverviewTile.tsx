import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useI18n } from '../../i18n/LocaleContext';

/**
 * One headline number. `deltaPct` is the change vs the previous window;
 * null means there was no previous activity to compare against, so we say
 * nothing rather than imply growth.
 */
export default function OverviewTile({
  icon,
  label,
  value,
  deltaPct,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  deltaPct?: number | null;
}) {
  const { t } = useI18n();
  // No movement is neutral — colouring 0% green would imply growth.
  const tone =
    deltaPct === 0
      ? 'text-slate-400'
      : (deltaPct ?? 0) > 0
        ? 'text-teal-600 dark:text-teal-400'
        : 'text-rose-600 dark:text-rose-400';

  return (
    <div className="rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <span className="flex items-center gap-2 text-xs text-slate-400">
        <span className="text-teal-600 dark:text-teal-400">{icon}</span>
        {label}
      </span>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {value}
        </span>
        {deltaPct !== null && deltaPct !== undefined && (
          <span
            title={t('overview.vs_previous')}
            className={cn('text-xs font-bold', tone)}
          >
            {deltaPct > 0 ? '+' : ''}
            {deltaPct}%
          </span>
        )}
      </div>
    </div>
  );
}
