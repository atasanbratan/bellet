import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { useI18n } from '../../i18n/LocaleContext';
import { Cover, CategoryIcon } from '../../components/visuals';
import { cn } from '../../lib/cn';
import type { Business, BusinessStatus } from '../../types';

const FILTERS: (BusinessStatus | 'ALL')[] = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'ALL',
];

const statusBadge: Record<BusinessStatus, string> = {
  PENDING: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
  APPROVED: 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300',
  REJECTED: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300',
};

export default function BusinessesReview() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<BusinessStatus | 'ALL'>('PENDING');
  const [items, setItems] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi
      .listBusinesses(filter === 'ALL' ? undefined : filter)
      .then(setItems)
      .finally(() => setLoading(false));
  };
  useEffect(load, [filter]);

  const act = async (id: string, action: 'approve' | 'reject') => {
    await (action === 'approve'
      ? adminApi.approveBusiness(id)
      : adminApi.rejectBusiness(id));
    load();
  };

  const catName = (slug?: string, fallback?: string) =>
    t(`cat_${slug}`, undefined, fallback ?? slug ?? '');

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition',
              filter === f
                ? 'bg-slate-900 dark:bg-slate-700 text-white shadow'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 shadow-sm hover:text-teal-600 dark:hover:text-teal-400',
            )}
          >
            {f === 'ALL' ? t('common.all') : t(`bstatus.${f}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-40 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800" />
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 py-16 text-center text-slate-400">
          {t('admin.empty')}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-4 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
            >
              <Link to={`/businesses/${b.id}`} className="flex-shrink-0">
                <Cover
                  name={b.name}
                  coverKey={b.id}
                  src={b.photos[0]}
                  slug={b.category?.slug}
                  className="h-14 w-14 rounded"
                  monogramClass="text-lg"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/businesses/${b.id}`}
                    className="font-bold hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    {b.name}
                  </Link>
                  {b.status && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[b.status]}`}
                    >
                      {t(`bstatus.${b.status}`)}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <CategoryIcon slug={b.category?.slug} className="h-3.5 w-3.5" />
                    {catName(b.category?.slug, b.category?.name)}
                  </span>
                  <span>
                    {t('admin.owner')}: {b.owner?.name ?? '—'} ({b.owner?.phone})
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/businesses/${b.id}`}
                  className="rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  {t('common.view')}
                </Link>
                {b.status !== 'APPROVED' && (
                  <button
                    onClick={() => act(b.id, 'approve')}
                    className="rounded bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-700"
                  >
                    {t('admin.approve')}
                  </button>
                )}
                {b.status !== 'REJECTED' && (
                  <button
                    onClick={() => act(b.id, 'reject')}
                    className="rounded border border-rose-300 dark:border-rose-800 px-3 py-1.5 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  >
                    {t('admin.reject')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
