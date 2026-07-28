import { Link } from 'react-router-dom';
import type { Offering } from '../../types';
import { Cover, SubjectIcon } from '../../components/visuals';
import { money } from '../../lib/format';
import { locText, subjectName } from '../../lib/i18nContent';
import { cn } from '../../lib/cn';
import { useI18n } from '../../i18n/LocaleContext';
import GroupScheduleRow from './GroupScheduleRow';

/**
 * A course on the centre page: summary row that expands to show its group
 * schedules. Booking itself lives on the course page, which is where a group
 * is actually picked and paid for.
 */
export default function CourseRow({
  offering: o,
  open,
  onToggle,
}: {
  offering: Offering;
  open: boolean;
  onToggle: () => void;
}) {
  const { t, locale } = useI18n();
  const groups = o.groups ?? [];

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border bg-white dark:bg-slate-900 transition',
        open
          ? 'border-teal-300 dark:border-teal-700'
          : 'border-slate-200/70 dark:border-slate-800',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full gap-4 p-4 text-left"
      >
        <Cover
          name={locText(o, 'title', locale)}
          coverKey={o.id}
          className="hidden h-24 w-40 flex-shrink-0 rounded sm:block"
          monogramClass="text-2xl"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              {o.subjects && o.subjects.length > 0 && (
                <div className="mb-1 flex flex-wrap gap-1">
                  {o.subjects.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1 rounded bg-teal-50 px-1.5 py-0.5 text-[11px] font-semibold text-teal-700 dark:bg-teal-950/50 dark:text-teal-400"
                    >
                      <SubjectIcon icon={s.icon} className="h-3 w-3" />
                      {subjectName(s, locale)}
                    </span>
                  ))}
                </div>
              )}
              <h3 className="truncate font-bold">{locText(o, 'title', locale)}</h3>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] text-slate-400">
                {t('common.price')}
              </span>
              <span className="font-bold tracking-tight">{money(o.price)}</span>
            </div>
          </div>

          {locText(o, 'description', locale) && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
              {locText(o, 'description', locale)}
            </p>
          )}

          <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
            <span>{t('course.groups_count', { n: groups.length })}</span>
            <span>
              {t('common.advance_word')} {money(o.prepaymentAmount)}
            </span>
            <span className="ml-auto font-medium text-teal-700 dark:text-teal-400">
              {open ? t('detail.hide_groups') : t('detail.show_groups')}
              <span className={cn('ml-1 inline-block transition', open && 'rotate-90')}>
                ›
              </span>
            </span>
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t('detail.groups')}
          </h4>
          {groups.length === 0 ? (
            <p className="text-sm text-slate-400">{t('group.none')}</p>
          ) : (
            <div className="space-y-2">
              {groups.map((g) => (
                <GroupScheduleRow key={g.id} group={g} />
              ))}
            </div>
          )}
          <Link
            to={`/courses/${o.id}`}
            className="mt-3 inline-block rounded bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            {t('course.view')}
          </Link>
        </div>
      )}
    </div>
  );
}
