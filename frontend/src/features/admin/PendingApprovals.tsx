import { useEffect, useState } from 'react';
import type { Business } from '../../types';
import { adminApi } from '../../api/admin';
import { Cover } from '../../components/visuals';
import { useI18n } from '../../i18n/LocaleContext';

/** Centres waiting on a decision — the admin's main queue. */
export default function PendingApprovals({ onSeeAll }: { onSeeAll: () => void }) {
  const { t } = useI18n();
  const [items, setItems] = useState<Business[] | null>(null);

  const load = () =>
    adminApi
      .listBusinesses('PENDING')
      .then(setItems)
      .catch(() => setItems([]));

  useEffect(() => {
    load();
  }, []);

  const act = async (id: string, action: 'approve' | 'reject') => {
    await (action === 'approve'
      ? adminApi.approveBusiness(id)
      : adminApi.rejectBusiness(id));
    load();
  };

  return (
    <section className="rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3">
        <h3 className="font-bold">{t('overview.approvals')}</h3>
        <button
          onClick={onSeeAll}
          className="text-xs font-medium text-teal-700 dark:text-teal-400 hover:underline"
        >
          {t('overview.see_all')}
        </button>
      </header>

      {items === null ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded bg-slate-200/70 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="p-6 text-center text-sm text-slate-400">
          {t('overview.no_pending')}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.slice(0, 5).map((b) => (
            <li key={b.id} className="flex items-center gap-3 px-4 py-2.5">
              <Cover
                name={b.name}
                coverKey={b.id}
                src={b.photos?.[0]}
                className="h-8 w-8 flex-shrink-0 rounded"
                monogramClass="text-[10px]"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{b.name}</div>
                <div className="truncate text-xs text-slate-400">
                  {b.owner?.name || b.owner?.phone}
                </div>
              </div>
              <button
                onClick={() => act(b.id, 'approve')}
                className="rounded bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-teal-700"
              >
                {t('admin.approve')}
              </button>
              <button
                onClick={() => act(b.id, 'reject')}
                className="rounded border border-rose-300 dark:border-rose-800 px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
              >
                {t('admin.reject')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
