import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Business } from '../types';
import { savedApi } from '../api/saved';
import { useSaved } from '../auth/SavedContext';
import { useI18n } from '../i18n/LocaleContext';
import BusinessGrid from '../features/home/BusinessGrid';

/** The centres this user bookmarked. */
export default function SavedPage() {
  const { t } = useI18n();
  const { count } = useSaved();
  const [items, setItems] = useState<Business[] | null>(null);

  // `count` changes when a heart is toggled here, so the list re-syncs.
  useEffect(() => {
    savedApi
      .list()
      .then(setItems)
      .catch(() => setItems([]));
  }, [count]);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight">{t('saved.title')}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {items === null
            ? t('common.loading')
            : t('saved.count', { n: items.length })}
        </p>
      </div>

      {items !== null && items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 py-16 text-center">
          <p className="text-slate-400">{t('saved.empty')}</p>
          <Link
            to="/"
            className="mt-3 inline-block rounded bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            {t('bookings.browse')}
          </Link>
        </div>
      ) : (
        <BusinessGrid businesses={items ?? []} loading={items === null} />
      )}
    </div>
  );
}
