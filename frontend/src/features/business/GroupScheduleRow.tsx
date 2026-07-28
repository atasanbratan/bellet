import type { Group } from '../../types';
import { useI18n } from '../../i18n/LocaleContext';
import { seatInfo } from '../../lib/seats';
import { provinceName } from '../../lib/i18nContent';
import { cn } from '../../lib/cn';
import GroupDates from '../../components/GroupDates';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="text-sm text-slate-700 dark:text-slate-200">{children}</span>
    </div>
  );
}

/** One group's schedule at a glance: days, time, teacher, seats, where. */
export default function GroupScheduleRow({ group: g }: { group: Group }) {
  const { t, locale } = useI18n();
  const seats = seatInfo(g);
  const filled = g.capacity > 0 ? Math.min(100, (seats.taken / g.capacity) * 100) : 0;

  return (
    <div className="grid gap-3 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 md:grid-cols-4">
      <Field label={t('group.days')}>
        {g.days.map((d) => t(`day_${d}`).slice(0, 3)).join(', ')}
      </Field>
      <Field label={t('common.time')}>
        {g.startTime}–{g.endTime}
      </Field>
      <Field label={t('common.teacher')}>
        {g.teacher?.name ?? (
          <span className="text-slate-400">{t('group.no_teacher')}</span>
        )}
      </Field>

      <div className="flex flex-col">
        <span className="text-[11px] uppercase tracking-wide text-slate-400">
          {t('common.seats')}
        </span>
        {seats.unlimited ? (
          <span className="text-sm text-slate-700 dark:text-slate-200">—</span>
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={cn('h-full', seats.full ? 'bg-rose-500' : 'bg-teal-600')}
                style={{ width: `${filled}%` }}
              />
            </div>
            <span className="whitespace-nowrap text-xs tabular-nums text-slate-600 dark:text-slate-300">
              {seats.taken}/{g.capacity}
            </span>
          </div>
        )}
      </div>

      {g.address && (
        <div className="text-xs text-slate-400 md:col-span-4">
          {provinceName(g.address.province, locale)} · {g.address.line}
        </div>
      )}

      <GroupDates group={g} className="md:col-span-4" />
    </div>
  );
}
