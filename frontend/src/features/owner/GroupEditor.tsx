import { useState } from 'react';
import api from '../../api/client';
import type { Address, Group, Teacher } from '../../types';
import { useI18n } from '../../i18n/LocaleContext';
import GroupCard from '../../components/GroupCard';
import GroupAddForm from './GroupAddForm';
import GroupDatesBulkPanel from './GroupDatesBulkPanel';
import { isConflict } from './utils';

/** Card grid of a course's groups (toparlar); the add form opens on demand. */
export default function GroupEditor({
  offeringId,
  groups,
  teachers,
  addresses,
  onChange,
}: {
  offeringId: string;
  groups: Group[];
  teachers: Teacher[];
  addresses: Address[];
  onChange: () => void;
}) {
  const { t } = useI18n();
  const [adding, setAdding] = useState(false);
  const [datesOpen, setDatesOpen] = useState(false);

  const remove = async (id: string) => {
    try {
      await api.delete(`/offerings/groups/${id}`);
      onChange();
    } catch (e) {
      alert(isConflict(e) ? t('dash.has_bookings') : String(e));
    }
  };

  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {t('group.title')}
        </span>
        <div className="flex items-center gap-3">
          {groups.length > 0 && (
            <button
              onClick={() => setDatesOpen(!datesOpen)}
              className="text-xs font-medium text-teal-600 dark:text-teal-400"
            >
              {datesOpen ? t('common.cancel') : t('dash.set_dates')}
            </button>
          )}
          <button
            onClick={() => setAdding(!adding)}
            className="text-xs font-medium text-teal-600 dark:text-teal-400"
          >
            {adding ? t('common.cancel') : `+ ${t('group.add')}`}
          </button>
        </div>
      </div>

      {datesOpen && (
        <GroupDatesBulkPanel
          offeringId={offeringId}
          groups={groups}
          onSaved={() => {
            setDatesOpen(false);
            onChange();
          }}
        />
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {groups.map((g) => (
          <GroupCard
            key={g.id}
            group={g}
            seatsMode="taken"
            corner={
              <button
                onClick={() => remove(g.id)}
                title={t('common.delete')}
                className="-mr-1 -mt-1 rounded px-1.5 text-lg leading-none text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400"
              >
                ×
              </button>
            }
          />
        ))}
      </div>
      {groups.length === 0 && !adding && (
        <p className="text-xs text-slate-400">{t('group.none')}</p>
      )}

      {adding && (
        <GroupAddForm
          offeringId={offeringId}
          teachers={teachers}
          addresses={addresses}
          onAdded={() => {
            setAdding(false);
            onChange();
          }}
        />
      )}
    </div>
  );
}
