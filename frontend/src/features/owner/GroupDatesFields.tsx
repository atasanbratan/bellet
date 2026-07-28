import { useI18n } from '../../i18n/LocaleContext';

/** Form value for a group's calendar fields (date strings as YYYY-MM-DD). */
export interface GroupDatesValue {
  startDate: string;
  durationWeeks: string;
  enrollFrom: string;
  enrollUntil: string;
}

export const emptyGroupDates: GroupDatesValue = {
  startDate: '',
  durationWeeks: '',
  enrollFrom: '',
  enrollUntil: '',
};

/** API payload — only non-empty fields, so a blank never clobbers on bulk apply. */
export function groupDatesPayload(v: GroupDatesValue) {
  return {
    startDate: v.startDate || undefined,
    durationWeeks: v.durationWeeks ? Number(v.durationWeeks) : undefined,
    enrollFrom: v.enrollFrom || undefined,
    enrollUntil: v.enrollUntil || undefined,
  };
}

const field =
  'w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1 text-sm';
const label = 'flex flex-col gap-0.5 text-xs text-slate-500 dark:text-slate-400';

/** Start date, duration (weeks), and the enrollment window (kabul edilişik). */
export default function GroupDatesFields({
  value,
  onChange,
}: {
  value: GroupDatesValue;
  onChange: (v: GroupDatesValue) => void;
}) {
  const { t } = useI18n();
  const set = (patch: Partial<GroupDatesValue>) => onChange({ ...value, ...patch });
  return (
    <div className="grid grid-cols-2 gap-2">
      <label className={label}>
        {t('group.start_date')}
        <input
          type="date"
          value={value.startDate}
          onChange={(e) => set({ startDate: e.target.value })}
          className={field}
        />
      </label>
      <label className={label}>
        {t('group.duration')}
        <input
          type="number"
          min={1}
          max={520}
          value={value.durationWeeks}
          onChange={(e) => set({ durationWeeks: e.target.value })}
          placeholder={t('group.weeks')}
          className={field}
        />
      </label>
      <label className={label}>
        {t('group.enroll_from')}
        <input
          type="date"
          value={value.enrollFrom}
          onChange={(e) => set({ enrollFrom: e.target.value })}
          className={field}
        />
      </label>
      <label className={label}>
        {t('group.enroll_until')}
        <input
          type="date"
          value={value.enrollUntil}
          onChange={(e) => set({ enrollUntil: e.target.value })}
          className={field}
        />
      </label>
    </div>
  );
}
