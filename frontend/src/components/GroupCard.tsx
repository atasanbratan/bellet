import type { ReactNode } from 'react';
import { useI18n } from '../i18n/LocaleContext';
import { cn } from '../lib/cn';
import { Avatar, ClockIcon, MapPinIcon } from './visuals';
import { seatInfo } from '../lib/seats';
import { provinceName } from '../lib/i18nContent';
import GroupDates from './GroupDates';
import type { Group } from '../types';

/**
 * One group (topar) as a card: day chips, time, teacher, seats.
 * `corner` renders top-right (e.g. owner's delete ×), `footer` at the bottom
 * (e.g. client's Book button). Owners see seats taken, clients seats left.
 */
export default function GroupCard({
  group: g,
  selected = false,
  seatsMode = 'left',
  corner,
  footer,
}: {
  group: Group;
  selected?: boolean;
  seatsMode?: 'left' | 'taken';
  corner?: ReactNode;
  footer?: ReactNode;
}) {
  const { t, locale } = useI18n();
  const seats = seatInfo(g);

  return (
    <div
      className={cn(
        'rounded-lg border bg-white dark:bg-slate-900 p-4 transition',
        selected
          ? 'border-teal-400 dark:border-teal-500 ring-2 ring-teal-200 dark:ring-teal-800'
          : 'border-slate-200/70 dark:border-slate-700',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {g.days.map((d) => (
            <span
              key={d}
              className="rounded bg-teal-100 dark:bg-teal-900/60 px-1.5 py-0.5 text-[11px] font-semibold text-teal-700 dark:text-teal-300"
            >
              {t(`day_${d}`).slice(0, 3)}
            </span>
          ))}
        </div>
        {corner}
      </div>

      <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
        <ClockIcon className="h-4 w-4" />
        {t(`time.${g.timeOfDay}`)} {g.startTime}–{g.endTime}
      </div>

      <GroupDates group={g} className="mt-1.5" />

      {g.address && (
        <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-400">
          <MapPinIcon className="h-3.5 w-3.5" />
          {provinceName(g.address.province, locale)} · {g.address.line}
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600 dark:text-slate-300">
        {g.teacher ? (
          <span className="inline-flex items-center gap-1.5">
            <Avatar name={g.teacher.name} />
            {g.teacher.name}
          </span>
        ) : (
          <span className="text-slate-400">{t('group.no_teacher')}</span>
        )}
        {!seats.unlimited && (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              seats.full
                ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'
                : 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300',
            )}
          >
            {seats.full && seatsMode === 'left'
              ? t('group.full')
              : seatsMode === 'left'
                ? t('group.seats_left', { n: seats.left, total: g.capacity })
                : t('group.seats_taken', { taken: seats.taken, total: g.capacity })}
          </span>
        )}
      </div>

      {footer}
    </div>
  );
}
