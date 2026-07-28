import type { Offering } from '../../types';
import { money } from '../../lib/format';
import { locText } from '../../lib/i18nContent';
import { seatInfo } from '../../lib/seats';
import { useI18n } from '../../i18n/LocaleContext';

/** Course list with a fill bar per course — how full its groups are overall. */
export default function CoursesSummary({
  offerings,
  onManage,
}: {
  offerings: Offering[];
  onManage: () => void;
}) {
  const { t, locale } = useI18n();

  return (
    <section className="rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3">
        <h3 className="font-bold">{t('overview.active_courses')}</h3>
        <button
          onClick={onManage}
          className="text-xs font-medium text-teal-700 dark:text-teal-400 hover:underline"
        >
          {t('overview.manage')}
        </button>
      </header>

      {offerings.length === 0 ? (
        <p className="p-6 text-center text-sm text-slate-400">
          {t('detail.no_courses')}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {offerings.map((o) => {
            const groups = o.groups ?? [];
            const seats = groups.map(seatInfo);
            const capacity = groups.reduce((n, g) => n + Math.max(g.capacity, 0), 0);
            const taken = seats.reduce((n, s) => n + s.taken, 0);
            const filled = capacity > 0 ? Math.min(100, (taken / capacity) * 100) : 0;

            return (
              <li key={o.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {locText(o, 'title', locale)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {t('course.groups_count', { n: groups.length })}
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {money(o.price)}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full bg-teal-600" style={{ width: `${filled}%` }} />
                  </div>
                  <span className="text-[11px] tabular-nums text-slate-400">
                    {capacity > 0 ? `${taken}/${capacity}` : '—'}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
