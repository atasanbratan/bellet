import { useEffect, useState } from 'react';
import type { Address, Province } from '../../types';
import { addressesApi } from '../../api/addresses';
import { provincesApi } from '../../api/provinces';
import { useI18n } from '../../i18n/LocaleContext';
import { provinceName } from '../../lib/i18nContent';
import { MapPinIcon } from '../../components/visuals';

const inputCls =
  'rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm';

/** Manage a business's physical locations (a center can have several). */
export default function AddressesPanel({ businessId }: { businessId: string }) {
  const { t, locale } = useI18n();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [provinceId, setProvinceId] = useState('');
  const [line, setLine] = useState('');

  const load = () => addressesApi.list(businessId).then(setAddresses);

  useEffect(() => {
    load();
    provincesApi.list().then((list) => {
      setProvinces(list);
      setProvinceId((cur) => cur || list[0]?.id || '');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provinceId || !line.trim()) return;
    await addressesApi.create(businessId, { provinceId, line: line.trim() });
    setLine('');
    load();
  };

  const remove = async (id: string) => {
    try {
      await addressesApi.remove(businessId, id);
      load();
    } catch {
      alert(t('address.in_use'));
    }
  };

  return (
    <section className="mt-4">
      <h3 className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        {t('address.title')}
      </h3>

      <div className="space-y-1.5">
        {addresses.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-2 rounded border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm"
          >
            <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            <span className="font-medium text-slate-600 dark:text-slate-300">
              {provinceName(a.province, locale)}
            </span>
            <span className="flex-1 truncate text-slate-500 dark:text-slate-400">
              {a.line}
            </span>
            <button
              onClick={() => remove(a.id)}
              title={t('common.delete')}
              className="rounded px-1.5 text-lg leading-none text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400"
            >
              ×
            </button>
          </div>
        ))}
        {addresses.length === 0 && (
          <p className="text-xs text-slate-400">{t('address.none')}</p>
        )}
      </div>

      <form onSubmit={add} className="mt-2 flex flex-wrap items-center gap-1.5">
        <select
          className={inputCls}
          value={provinceId}
          onChange={(e) => setProvinceId(e.target.value)}
        >
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>
              {provinceName(p, locale)}
            </option>
          ))}
        </select>
        <input
          className={`${inputCls} flex-1`}
          placeholder={t('address.line_ph')}
          value={line}
          onChange={(e) => setLine(e.target.value)}
        />
        <button className="rounded bg-slate-800 dark:bg-slate-700 px-3 py-1.5 text-sm text-white">
          {t('address.add')}
        </button>
      </form>
    </section>
  );
}
