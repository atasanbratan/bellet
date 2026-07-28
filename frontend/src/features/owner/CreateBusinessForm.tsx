import { useState } from 'react';
import api from '../../api/client';
import type { Category } from '../../types';
import { useI18n } from '../../i18n/LocaleContext';

const inputCls =
  'w-full rounded border border-slate-300 dark:border-slate-600 px-3 py-2.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800';

export default function CreateBusinessForm({
  categories,
  onCreated,
}: {
  categories: Category[];
  onCreated: () => void;
}) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    description: '',
  });

  const catName = (slug?: string, fallback?: string) =>
    t(`cat_${slug}`, undefined, fallback ?? slug ?? '');

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/businesses', {
      ...form,
      categoryId: form.categoryId || categories[0]?.id,
    });
    setForm({ name: '', categoryId: '', description: '' });
    onCreated();
  };

  return (
    <form
      onSubmit={create}
      className="space-y-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
    >
      <h2 className="font-bold">{t('dash.add_business')}</h2>
      <input
        className={inputCls}
        placeholder={t('common.name')}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <select
        className={inputCls}
        value={form.categoryId}
        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {catName(c.slug, c.name)}
          </option>
        ))}
      </select>
      <textarea
        className={inputCls}
        placeholder={t('common.description')}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <button className="w-full rounded bg-teal-600 py-2.5 font-semibold text-white hover:bg-teal-700">
        {t('dash.create_business')}
      </button>
    </form>
  );
}
