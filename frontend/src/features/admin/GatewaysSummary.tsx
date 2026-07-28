import { useEffect, useState } from 'react';
import type { Gateway } from '../../types';
import { adminApi } from '../../api/admin';
import { relativeTime } from '../../lib/relativeTime';
import { useI18n } from '../../i18n/LocaleContext';
import { cn } from '../../lib/cn';

/** Which SMS gateway phones are alive — verification breaks without one. */
export default function GatewaysSummary({ onSeeAll }: { onSeeAll: () => void }) {
  const { t, locale } = useI18n();
  const [items, setItems] = useState<Gateway[] | null>(null);

  useEffect(() => {
    const load = () =>
      adminApi
        .listGateways()
        .then(setItems)
        .catch(() => setItems([]));
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3">
        <h3 className="font-bold">{t('admin.tab_gateways')}</h3>
        <button
          onClick={onSeeAll}
          className="text-xs font-medium text-teal-700 dark:text-teal-400 hover:underline"
        >
          {t('overview.see_all')}
        </button>
      </header>

      {items === null ? (
        <div className="space-y-2 p-4">
          <div className="h-10 animate-pulse rounded bg-slate-200/70 dark:bg-slate-800" />
        </div>
      ) : items.length === 0 ? (
        <p className="p-6 text-center text-sm text-slate-400">
          {t('gateway.empty')}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.slice(0, 5).map((g) => (
            <li key={g.id} className="flex items-center gap-2.5 px-4 py-2.5">
              <span
                className={cn(
                  'h-2 w-2 flex-shrink-0 rounded-full',
                  g.online ? 'bg-teal-500' : 'bg-slate-400',
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium tabular-nums">
                  {g.phoneNumber}
                </div>
                <div className="truncate text-xs text-slate-400">
                  {t('gateway.last_seen')}: {relativeTime(g.lastSeenAt, locale)}
                </div>
              </div>
              <span
                className={cn(
                  'flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold',
                  g.online
                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
                )}
              >
                {t(g.online ? 'gateway.online' : 'gateway.offline')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
