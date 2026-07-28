import { useEffect, useState } from 'react';
import type { Booking } from '../../types';
import { ownerApi } from '../../api/owner';
import { EMPTY_FILTERS } from '../bookings/useBookings';
import { money } from '../../lib/format';
import { locText } from '../../lib/i18nContent';
import { useI18n } from '../../i18n/LocaleContext';
import { cn } from '../../lib/cn';

const badge: Record<string, string> = {
  CONFIRMED: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  CANCELLED: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
  COMPLETED: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
};

/** The five newest bookings — a glance, not the full table. */
export default function RecentBookings({ onSeeAll }: { onSeeAll: () => void }) {
  const { t, locale } = useI18n();
  const [items, setItems] = useState<Booking[] | null>(null);

  useEffect(() => {
    ownerApi
      .listBookings({ page: 1, pageSize: 5, filters: EMPTY_FILTERS })
      .then((d) => setItems(d.items))
      .catch(() => setItems([]));
  }, []);

  return (
    <section className="rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3">
        <h3 className="font-bold">{t('overview.recent_bookings')}</h3>
        <button
          onClick={onSeeAll}
          className="text-xs font-medium text-teal-700 dark:text-teal-400 hover:underline"
        >
          {t('overview.see_all')}
        </button>
      </header>

      {items === null ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-8 animate-pulse rounded bg-slate-200/70 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="p-6 text-center text-sm text-slate-400">
          {t('bookings.empty')}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((b) => (
            <li key={b.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span className="min-w-0 flex-1 truncate">
                {b.client?.name || b.client?.phone}
              </span>
              <span className="hidden min-w-0 flex-1 truncate text-slate-500 dark:text-slate-400 sm:block">
                {b.offering ? locText(b.offering, 'title', locale) : '—'}
              </span>
              <span className="tabular-nums text-slate-500 dark:text-slate-400">
                {b.payment ? money(b.payment.amount) : '—'}
              </span>
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px] font-bold',
                  badge[b.status],
                )}
              >
                {t(`status.${b.status}`)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
