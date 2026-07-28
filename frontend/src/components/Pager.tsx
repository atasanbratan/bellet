import { cn } from '../lib/cn';
import { useI18n } from '../i18n/LocaleContext';
import { GAP, pageWindow } from '../lib/pageWindow';

const arrow = 'px-2 py-2 text-slate-400 disabled:opacity-30 enabled:hover:bg-slate-100 dark:enabled:hover:bg-slate-800 rounded';

/** Centred numbered pager (1 … 5 6 7 … 12) for card grids. */
export default function Pager({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
}) {
  const { t } = useI18n();
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label={t('pager.label')}
      className="mt-8 flex justify-center"
    >
      <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          aria-label={t('pager.prev')}
          className={arrow}
        >
          ‹
        </button>
        {pageWindow(page, totalPages).map((item, i) =>
          item === GAP ? (
            <span key={`gap-${i}`} className="px-2 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPage(item)}
              aria-current={item === page ? 'page' : undefined}
              className={cn(
                'min-w-[36px] rounded px-3 py-1.5 text-sm font-medium',
                item === page
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
              )}
            >
              {item}
            </button>
          ),
        )}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          aria-label={t('pager.next')}
          className={arrow}
        >
          ›
        </button>
      </div>
    </nav>
  );
}
