import { useI18n } from '../i18n/LocaleContext';
import { cn } from '../lib/cn';
import type { Group } from '../types';
import { formatDate } from '../lib/dates';
import { enrollmentStatus } from '../lib/enrollment';
import { CalendarIcon } from './visuals';

const badgeCls = {
  open: 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300',
  not_open: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
  closed: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300',
} as const;

/** Start date, duration in weeks, and an enrollment-window badge for a group. */
export default function GroupDates({
  group: g,
  className,
}: {
  group: Group;
  className?: string;
}) {
  const { t, locale } = useI18n();
  const status = enrollmentStatus(g);
  if (!g.startDate && !g.durationWeeks && status === 'none') return null;

  // 'open' with no closing date has no urgency to show — skip the badge.
  const badge =
    status === 'open' && g.enrollUntil
      ? { cls: badgeCls.open, text: t('group.enroll_open_until', { date: formatDate(g.enrollUntil, locale) }) }
      : status === 'not_open'
        ? { cls: badgeCls.not_open, text: t('group.enroll_opens', { date: formatDate(g.enrollFrom, locale) }) }
        : status === 'closed'
          ? { cls: badgeCls.closed, text: t('group.enroll_closed') }
          : null;

  return (
    <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 text-xs', className)}>
      {g.startDate && (
        <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <CalendarIcon className="h-3.5 w-3.5" />
          {t('group.starts', { date: formatDate(g.startDate, locale) })}
        </span>
      )}
      {g.durationWeeks ? (
        <span className="text-slate-500 dark:text-slate-400">
          {t('group.weeks_n', { n: g.durationWeeks })}
        </span>
      ) : null}
      {badge && (
        <span className={cn('rounded-full px-2 py-0.5 font-medium', badge.cls)}>
          {badge.text}
        </span>
      )}
    </div>
  );
}
