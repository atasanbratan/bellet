import { useI18n } from '../i18n/LocaleContext';

/** Footer pager of the data tables: total count + prev/next. */
export default function TablePager({
  page,
  totalPages,
  total,
  loading,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  onPage: (page: number) => void;
}) {
  const { t } = useI18n();
  const btnCls =
    'rounded px-3 py-1.5 text-slate-600 dark:text-slate-300 disabled:opacity-40 enabled:hover:bg-slate-100 dark:enabled:hover:bg-slate-800';

  return (
    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-4 py-3 text-sm">
      <span className="text-slate-400">{t('pager.total', { n: total })}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1 || loading}
          className={btnCls}
        >
          ‹ {t('pager.prev')}
        </button>
        <span className="text-slate-500 dark:text-slate-400">
          {t('pager.page', { page, pages: Math.max(totalPages, 1) })}
        </span>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages || loading}
          className={btnCls}
        >
          {t('pager.next')} ›
        </button>
      </div>
    </div>
  );
}
