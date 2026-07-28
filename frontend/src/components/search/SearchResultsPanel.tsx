import { useI18n } from '../../i18n/LocaleContext';
import { money } from '../../lib/format';
import { locText } from '../../lib/i18nContent';
import { Cover } from '../visuals';
import type { SearchResults } from './useGlobalSearch';

/** Dropdown body: grouped Centers / Courses / Teachers rows + "see all". */
export default function SearchResultsPanel({
  q,
  results,
  loading,
  hasResults,
  onGo,
}: {
  q: string;
  results: SearchResults;
  loading: boolean;
  hasResults: boolean;
  onGo: (path: string) => void;
}) {
  const { t, locale } = useI18n();

  if (loading && !hasResults)
    return <div className="px-3 py-4 text-sm text-slate-400">…</div>;
  if (!hasResults)
    return (
      <div className="px-3 py-4 text-sm text-slate-400">
        {t('search.no_results', { q })}
      </div>
    );

  return (
    <>
      {results.businesses.length > 0 && (
        <Section title={t('search.centers')}>
          {results.businesses.map((b) => (
            <Row key={b.id} onClick={() => onGo(`/businesses/${b.id}`)}>
              <Cover
                name={b.name}
                coverKey={b.id}
                src={b.photos?.[0]}
                slug={b.category?.slug}
                className="h-9 w-9 flex-shrink-0 rounded"
                monogramClass="text-sm"
              />
              <RowText main={b.name} />
            </Row>
          ))}
        </Section>
      )}

      {results.courses.length > 0 && (
        <Section title={t('search.courses')}>
          {results.courses.map((c) => (
            <Row key={c.id} onClick={() => onGo(`/courses/${c.id}`)}>
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.25c-2.5-1.5-5.5-1.5-8 0v11.5c2.5-1.5 5.5-1.5 8 0 2.5-1.5 5.5-1.5 8 0V6.25c-2.5-1.5-5.5-1.5-8 0zm0 0v11.5"
                  />
                </svg>
              </span>
              <RowText
                main={locText(c, 'title', locale)}
                sub={`${c.business.name} · ${money(c.price)}`}
              />
            </Row>
          ))}
        </Section>
      )}

      {results.teachers.length > 0 && (
        <Section title={t('search.teachers')}>
          {results.teachers.map((tc) => (
            <Row key={tc.id} onClick={() => onGo(`/businesses/${tc.business.id}`)}>
              {tc.photo ? (
                <img
                  src={tc.photo}
                  alt=""
                  className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-500 dark:text-slate-400">
                  {tc.name.slice(0, 1).toUpperCase()}
                </span>
              )}
              <RowText main={tc.name} sub={tc.business.name} />
            </Row>
          ))}
        </Section>
      )}

      <button
        onClick={() => onGo(`/?search=${encodeURIComponent(q)}`)}
        className="mt-1 w-full rounded px-3 py-2.5 text-left text-sm font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/50"
      >
        {t('search.see_all', { q })} →
      </button>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60"
    >
      {children}
    </button>
  );
}

function RowText({ main, sub }: { main: string; sub?: string }) {
  return (
    <span className="min-w-0">
      <span className="block truncate font-medium">{main}</span>
      {sub && <span className="block truncate text-xs text-slate-400">{sub}</span>}
    </span>
  );
}
