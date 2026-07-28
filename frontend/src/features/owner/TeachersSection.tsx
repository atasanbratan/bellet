import { useState } from 'react';
import api from '../../api/client';
import type { Teacher } from '../../types';
import { useI18n } from '../../i18n/LocaleContext';
import { isConflict, uploadImage } from './utils';
import TeacherRow from './TeacherRow';
import TeacherAddForm from './TeacherAddForm';

/** Teachers as a data table; the add form opens behind "+ Add teacher". */
export default function TeachersSection({
  businessId,
  teachers,
  onChange,
}: {
  businessId: string;
  teachers: Teacher[];
  onChange: () => void;
}) {
  const { t } = useI18n();
  const [adding, setAdding] = useState(false);

  const remove = async (tc: Teacher) => {
    if (!confirm(t('dash.delete_teacher_confirm', { name: tc.name }))) return;
    try {
      await api.delete(`/teachers/${tc.id}`);
      onChange();
    } catch (e) {
      alert(isConflict(e) ? t('dash.has_bookings') : String(e));
    }
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          {t('detail.teachers')}
        </h3>
        <button
          onClick={() => setAdding(!adding)}
          className="rounded bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
        >
          {adding ? t('common.cancel') : `+ ${t('dash.add_teacher')}`}
        </button>
      </div>

      {adding && (
        <TeacherAddForm
          businessId={businessId}
          onAdded={() => {
            setAdding(false);
            onChange();
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="overflow-hidden rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">{t('common.teacher')}</th>
                <th className="px-4 py-3 font-medium">{t('table.bio')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {teachers.map((tc) => (
                <TeacherRow
                  key={tc.id}
                  teacher={tc}
                  onUploadPhoto={async (f) => {
                    if (f) {
                      await uploadImage(`/teachers/${tc.id}/photo`, f);
                      onChange();
                    }
                  }}
                  onDelete={() => remove(tc)}
                  onSaved={onChange}
                />
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-slate-400">
                    {t('detail.no_teachers')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
