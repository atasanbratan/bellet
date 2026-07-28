import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/cn';
import { useI18n } from '../i18n/LocaleContext';
import { useGlobalSearch } from './search/useGlobalSearch';
import SearchResultsPanel from './search/SearchResultsPanel';

/** Udemy-style nav search bar with a live-suggestions dropdown. */
export default function GlobalSearch({ className }: { className?: string }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { q, setQ, results, open, setOpen, loading, boxRef, hasResults } =
    useGlobalSearch();

  const go = (path: string) => {
    setOpen(false);
    setQ('');
    navigate(path);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) go(`/?search=${encodeURIComponent(q.trim())}`);
  };

  const showPanel = open && q.trim().length >= 2;

  return (
    <div ref={boxRef} className={cn('relative', className)}>
      <form onSubmit={submit}>
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
          />
        </svg>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
          placeholder={t('search.placeholder')}
          className="h-11 w-full rounded-full border border-slate-300 dark:border-slate-600 bg-white/90 dark:bg-slate-900/90 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800"
        />
      </form>

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-xl shadow-slate-900/10">
          <SearchResultsPanel
            q={q.trim()}
            results={results}
            loading={loading}
            hasResults={hasResults}
            onGo={go}
          />
        </div>
      )}
    </div>
  );
}
