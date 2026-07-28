import { useState } from 'react';
import api from '../../api/client';
import type { Address, Teacher, TimeOfDay } from '../../types';
import { useI18n } from '../../i18n/LocaleContext';
import { provinceName } from '../../lib/i18nContent';
import GroupDaysField from './GroupDaysField';
import GroupDatesFields, {
  GroupDatesValue,
  emptyGroupDates,
  groupDatesPayload,
} from './GroupDatesFields';

const box = 'rounded border border-slate-300 dark:border-slate-600 px-1 py-0.5 text-xs';

/** Form to add one group: schedule + teacher + address + capacity + dates. */
export default function GroupAddForm({
  offeringId,
  teachers,
  addresses,
  onAdded,
}: {
  offeringId: string;
  teachers: Teacher[];
  addresses: Address[];
  onAdded: () => void;
}) {
  const { t, locale } = useI18n();
  const [teacherId, setTeacherId] = useState('');
  const [addressId, setAddressId] = useState('');
  const [days, setDays] = useState<number[]>([1, 3, 5]);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('MORNING');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:30');
  const [capacity, setCapacity] = useState('15');
  const [dates, setDates] = useState<GroupDatesValue>(emptyGroupDates);

  const add = async () => {
    if (days.length === 0) return;
    await api.post(`/offerings/${offeringId}/groups`, {
      teacherId: teacherId || undefined,
      addressId: addressId || undefined,
      days,
      timeOfDay,
      startTime: start,
      endTime: end,
      capacity: Number(capacity) || 0,
      ...groupDatesPayload(dates),
    });
    onAdded();
  };

  return (
    <div className="mt-2 space-y-1.5 rounded border border-slate-200 dark:border-slate-700 p-2">
      <GroupDaysField days={days} onChange={setDays} />
      <div className="flex flex-wrap items-center gap-1">
        <select
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
          className={box}
        >
          <option value="MORNING">{t('time.MORNING')}</option>
          <option value="AFTERNOON">{t('time.AFTERNOON')}</option>
          <option value="EVENING">{t('time.EVENING')}</option>
        </select>
        <input value={start} onChange={(e) => setStart(e.target.value)} className={`w-14 ${box}`} />
        <input value={end} onChange={(e) => setEnd(e.target.value)} className={`w-14 ${box}`} />
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          title={t('common.capacity')}
          className={`w-12 ${box}`}
        />
      </div>
      <div className="flex items-center gap-1">
        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className={`flex-1 ${box}`}
        >
          <option value="">{t('group.no_teacher')}</option>
          {teachers.map((tc) => (
            <option key={tc.id} value={tc.id}>
              {tc.name}
            </option>
          ))}
        </select>
        <select
          value={addressId}
          onChange={(e) => setAddressId(e.target.value)}
          className={`flex-1 ${box}`}
        >
          <option value="">{t('group.no_address')}</option>
          {addresses.map((a) => (
            <option key={a.id} value={a.id}>
              {provinceName(a.province, locale)} · {a.line}
            </option>
          ))}
        </select>
        <button
          onClick={add}
          type="button"
          className="rounded bg-slate-800 dark:bg-slate-700 px-2 py-0.5 text-xs text-white"
        >
          {t('group.add')}
        </button>
      </div>
      <GroupDatesFields value={dates} onChange={setDates} />
    </div>
  );
}
