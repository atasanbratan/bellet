import { useState } from 'react';
import api from '../../api/client';
import { useI18n } from '../../i18n/LocaleContext';
import type { Locale } from '../../i18n/translations';
import {
  emptyLangValues,
  filledLocales,
  langFields,
  type LangValues,
} from '../../lib/i18nContent';
import LangTabs from '../../components/LangTabs';
import SubjectPicker from './SubjectPicker';

/** Form to add a new course: multilingual title + price + advance. */
export default function OfferingAddForm({
  businessId,
  onAdded,
  onCancel,
}: {
  businessId: string;
  onAdded: () => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [title, setTitle] = useState<LangValues>(emptyLangValues());
  const [lang, setLang] = useState<Locale>('tk');
  const [form, setForm] = useState({ price: '', prepaymentAmount: '' });
  const [subjectIds, setSubjectIds] = useState<string[]>([]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Object.values(title).some((v) => v.trim())) return;
    await api.post('/offerings', {
      businessId,
      ...langFields('title', title),
      price: Number(form.price),
      prepaymentAmount: Number(form.prepaymentAmount),
      subjectIds,
    });
    onAdded();
  };

  return (
    <form
      onSubmit={add}
      className="mb-3 space-y-2 rounded border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/40 p-3"
    >
      <LangTabs active={lang} onChange={setLang} filled={filledLocales(title)} />
      <input
        className="w-full rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm"
        placeholder={`${t('dash.course_title_ph')} (${lang.toUpperCase()})`}
        value={title[lang]}
        onChange={(e) => setTitle({ ...title, [lang]: e.target.value })}
      />
      <div className="flex gap-2">
        <input
          type="number"
          className="w-full rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm"
          placeholder={t('common.price')}
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="number"
          className="w-full rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm"
          placeholder={t('common.advance_cap')}
          value={form.prepaymentAmount}
          onChange={(e) =>
            setForm({ ...form, prepaymentAmount: e.target.value })
          }
          required
        />
      </div>
      <SubjectPicker selected={subjectIds} onChange={setSubjectIds} />
      <div className="flex gap-2">
        <button className="rounded bg-teal-600 px-3 py-1.5 text-sm font-medium text-white">
          {t('dash.add_course')}
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
