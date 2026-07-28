import { Link } from 'react-router-dom';
import type { Business } from '../../types';
import { Cover, MapPinIcon, SubjectIcon } from '../../components/visuals';
import SaveButton from '../../components/SaveButton';
import { useI18n } from '../../i18n/LocaleContext';
import { locText, provinceName, subjectName } from '../../lib/i18nContent';

const GRID = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

/** Card grid of centres with loading skeleton and empty state. */
export default function BusinessGrid({
  businesses,
  loading,
}: {
  businesses: Business[];
  loading: boolean;
}) {
  const { t, locale } = useI18n();

  if (loading) {
    return (
      <div className={GRID}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-52 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 py-16 text-center text-slate-400">
        {t('home.empty')}
      </div>
    );
  }

  return (
    <div className={GRID}>
      {businesses.map((b) => {
        const region = b.addresses?.[0]?.province;
        const subjects = b.subjects ?? [];
        return (
          <Link
            key={b.id}
            to={`/businesses/${b.id}`}
            className="card-hover group flex flex-col overflow-hidden rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900"
          >
            <div className="relative">
              <Cover
                name={b.name}
                coverKey={b.id}
                src={b.photos[0]}
                className="aspect-[16/9] w-full"
                monogramClass="text-2xl"
              />
              {subjects[0] && (
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded border border-slate-200/60 bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-teal-700 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/85 dark:text-teal-300">
                  <SubjectIcon icon={subjects[0].icon} className="h-3 w-3" />
                  {subjectName(subjects[0], locale)}
                  {subjects.length > 1 && (
                    <span className="text-slate-400">+{subjects.length - 1}</span>
                  )}
                </span>
              )}
              <span className="absolute right-2 top-2">
                <SaveButton businessId={b.id} />
              </span>
            </div>

            <div className="flex flex-1 flex-col p-3">
              <div className="truncate text-sm font-bold tracking-tight group-hover:text-teal-700 dark:group-hover:text-teal-400">
                {b.name}
              </div>
              {locText(b, 'description', locale) && (
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                  {locText(b, 'description', locale)}
                </p>
              )}
              <span className="mb-3 mt-2 inline-flex min-w-0 items-center gap-1 truncate text-[11px] text-slate-400">
                <MapPinIcon className="h-3 w-3 flex-shrink-0" />
                {region ? provinceName(region, locale) : t('common.turkmenistan')}
              </span>

              <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2.5">
                <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400">
                  {t('home.courses_count', { n: b._count?.offerings ?? 0 })}
                </span>
                <span className="text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600">
                  →
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
