import { useState } from 'react';
import api from '../../api/client';
import type { Offering } from '../../types';
import { useI18n } from '../../i18n/LocaleContext';
import type { Locale } from '../../i18n/translations';
import {
  filledLocales,
  langFields,
  toLangValues,
  type LangValues,
} from '../../lib/i18nContent';
import LangTabs from '../../components/LangTabs';
import SubjectPicker from './SubjectPicker';

/** Inline editor for a course: multilingual title/description + prices. */
export default function OfferingEditForm({
  offering,
  onSaved,
}: {
  offering: Offering;
  onSaved: () => void;
}) {
  const { t } = useI18n();
  const [lang, setLang] = useState<Locale>('tk');
  const [title, setTitle] = useState<LangValues>(() =>
    toLangValues(offering as unknown as Record<string, unknown>, 'title'),
  );
  const [description, setDescription] = useState<LangValues>(() =>
    toLangValues(offering as unknown as Record<string, unknown>, 'description'),
  );
  const [form, setForm] = useState({
    price: String(offering.price),
    prepaymentAmount: String(offering.prepaymentAmount),
  });
  const [subjectIds, setSubjectIds] = useState<string[]>(
    () => offering.subjects?.map((s) => s.id) ?? [],
  );

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Object.values(title).some((v) => v.trim())) return;
    await api.patch(`/offerings/${offering.id}`, {
      ...langFields('title', title),
      ...langFields('description', description),
      price: Number(form.price),
      prepaymentAmount: Number(form.prepaymentAmount),
      subjectIds,
    });
    onSaved();
  };

  return (
    <form
      onSubmit={save}
      className="mt-2 space-y-1.5 rounded border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/40 p-2"
    >
      <LangTabs
        active={lang}
        onChange={setLang}
        filled={filledLocales(title, description)}
      />
      <input
        className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1 text-sm"
        placeholder={`${t('dash.course_title_ph')} (${lang.toUpperCase()})`}
        value={title[lang]}
        onChange={(e) => setTitle({ ...title, [lang]: e.target.value })}
      />
      <textarea
        className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1 text-sm"
        placeholder={`${t('common.description')} (${lang.toUpperCase()})`}
        value={description[lang]}
        onChange={(e) =>
          setDescription({ ...description, [lang]: e.target.value })
        }
        rows={2}
      />
      <SubjectPicker selected={subjectIds} onChange={setSubjectIds} />
      <div className="flex gap-1.5">
        <input
          type="number"
          className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1 text-sm"
          placeholder={t('common.price')}
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="number"
          className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1 text-sm"
          placeholder={t('common.advance_cap')}
          value={form.prepaymentAmount}
          onChange={(e) => setForm({ ...form, prepaymentAmount: e.target.value })}
          required
        />
        <button className="flex-shrink-0 rounded bg-teal-600 px-3 py-1 text-sm text-white">
          {t('common.save')}
        </button>
      </div>
    </form>
  );
}
