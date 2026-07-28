import { useI18n } from '../../i18n/LocaleContext';

/** Weekday multi-select chips with 1·3·5 / 2·4·6 presets. */
export default function GroupDaysField({
  days,
  onChange,
}: {
  days: number[];
  onChange: (days: number[]) => void;
}) {
  const { t } = useI18n();
  const toggle = (d: number) =>
    onChange(days.includes(d) ? days.filter((x) => x !== d) : [...days, d].sort());
  return (
    <div className="flex flex-wrap gap-1">
      {[0, 1, 2, 3, 4, 5, 6].map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => toggle(d)}
          className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
            days.includes(d)
              ? 'bg-teal-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}
        >
          {t(`day_${d}`).slice(0, 2)}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange([1, 3, 5])}
        className="rounded bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-[11px]"
      >
        1·3·5
      </button>
      <button
        type="button"
        onClick={() => onChange([2, 4, 6])}
        className="rounded bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-[11px]"
      >
        2·4·6
      </button>
    </div>
  );
}
