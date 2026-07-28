import { useState } from 'react';
import api from '../../api/client';
import type { Group } from '../../types';
import { useI18n } from '../../i18n/LocaleContext';
import { cn } from '../../lib/cn';
import GroupDatesFields, {
  GroupDatesValue,
  emptyGroupDates,
  groupDatesPayload,
} from './GroupDatesFields';

/** Apply one set of dates to several groups of a course at once. */
export default function GroupDatesBulkPanel({
  offeringId,
  groups,
  onSaved,
}: {
  offeringId: string;
  groups: Group[];
  onSaved: () => void;
}) {
  const { t } = useI18n();
  const [dates, setDates] = useState<GroupDatesValue>(emptyGroupDates);
  const [selected, setSelected] = useState<string[]>(() => groups.map((g) => g.id));
  const [busy, setBusy] = useState(false);

  const allOn = selected.length === groups.length;
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const apply = async () => {
    if (selected.length === 0) return;
    setBusy(true);
    try {
      await api.patch(`/offerings/${offeringId}/groups/dates`, {
        groupIds: selected,
        ...groupDatesPayload(dates),
      });
      onSaved();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-2 space-y-2 rounded border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/40 p-2">
      <GroupDatesFields value={dates} onChange={setDates} />
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {t('dash.apply_to')}
        </span>
        <button
          type="button"
          onClick={() => setSelected(allOn ? [] : groups.map((g) => g.id))}
          className="text-xs font-medium text-teal-600 dark:text-teal-400"
        >
          {allOn ? t('dash.select_none') : t('dash.select_all')}
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => toggle(g.id)}
            className={cn(
              'rounded border px-2 py-1 text-[11px]',
              selected.includes(g.id)
                ? 'border-teal-400 dark:border-teal-500 bg-white dark:bg-slate-900 ring-2 ring-teal-200 dark:ring-teal-800'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400',
            )}
          >
            {g.days.map((d) => t(`day_${d}`).slice(0, 2)).join('·')} {g.startTime}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={apply}
        disabled={busy || selected.length === 0}
        className="rounded bg-teal-600 px-3 py-1 text-sm text-white disabled:opacity-50"
      >
        {t('dash.apply_to_selected')}
      </button>
    </div>
  );
}
