import { useEffect, useState } from 'react';
import api from '../../api/client';
import type { BusinessDetail } from '../../types';
import { useI18n } from '../../i18n/LocaleContext';
import type { Locale } from '../../i18n/translations';
import {
  emptyLangValues,
  filledLocales,
  langFields,
  toLangValues,
  type LangValues,
} from '../../lib/i18nContent';
import LangTabs from '../../components/LangTabs';
import { isConflict } from './utils';

/** Edit name + multilingual description; delete the business. */
export default function BusinessEditForm({
  biz,
  onChange,
  onDeleted,
}: {
  biz: BusinessDetail;
  onChange: () => void;
  onDeleted: () => void;
}) {
  const { t } = useI18n();
  const [edit, setEdit] = useState({ name: '' });
  const [desc, setDesc] = useState<LangValues>(emptyLangValues());
  const [lang, setLang] = useState<Locale>('tk');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEdit({ name: biz.name ?? '' });
    setDesc(toLangValues(biz as unknown as Record<string, unknown>, 'description'));
  }, [biz]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.patch(`/businesses/${biz.id}`, {
      name: edit.name,
      ...langFields('description', desc),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onChange();
  };

  const remove = async () => {
    if (!confirm(t('dash.delete_business_confirm', { name: biz.name }))) return;
    try {
      await api.delete(`/businesses/${biz.id}`);
      onDeleted();
    } catch (e) {
      alert(isConflict(e) ? t('dash.has_bookings') : String(e));
    }
  };

  return (
    <section className="mt-4">
      <h3 className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        {t('dash.edit_business')}
      </h3>
      <form onSubmit={save} className="space-y-2">
        <input
          className="w-full rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm"
          placeholder={t('common.name')}
          value={edit.name}
          onChange={(e) => setEdit({ ...edit, name: e.target.value })}
          required
        />
        <div className="space-y-1">
          <LangTabs active={lang} onChange={setLang} filled={filledLocales(desc)} />
          <textarea
            className="w-full rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm"
            placeholder={`${t('common.description')} (${lang.toUpperCase()})`}
            value={desc[lang]}
            onChange={(e) => setDesc({ ...desc, [lang]: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded bg-slate-800 dark:bg-slate-700 px-3 py-1.5 text-sm text-white">
            {t('common.save')}
          </button>
          {saved && (
            <span className="text-sm text-teal-600 dark:text-teal-400">{t('dash.saved')}</span>
          )}
          <button
            type="button"
            onClick={remove}
            className="ml-auto rounded border border-rose-300 dark:border-rose-800 px-3 py-1.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
          >
            {t('dash.delete_business')}
          </button>
        </div>
      </form>
    </section>
  );
}
