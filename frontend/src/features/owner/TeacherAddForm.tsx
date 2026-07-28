import { useState } from 'react';
import api from '../../api/client';
import { useI18n } from '../../i18n/LocaleContext';

/** Form to add one teacher: name + bio. */
export default function TeacherAddForm({
  businessId,
  onAdded,
  onCancel,
}: {
  businessId: string;
  onAdded: () => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: '', bio: '' });

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/teachers', { businessId, ...form });
    onAdded();
  };

  return (
    <form
      onSubmit={add}
      className="mb-3 space-y-2 rounded border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/40 p-3"
    >
      <input
        className="w-full rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm"
        placeholder={t('dash.teacher_name_ph')}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        className="w-full rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm"
        placeholder={t('dash.bio_ph')}
        value={form.bio}
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
      />
      <div className="flex gap-2">
        <button className="rounded bg-teal-600 px-3 py-1.5 text-sm font-medium text-white">
          {t('dash.add_teacher')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {t('common.cancel')}
        </button>
      </div>
    </form>
  );
}
