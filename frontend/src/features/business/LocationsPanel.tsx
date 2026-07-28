import type { Address } from '../../types';
import { useI18n } from '../../i18n/LocaleContext';
import { provinceName } from '../../lib/i18nContent';
import { MapPinIcon } from '../../components/visuals';

/** "Our locations" — every building this centre teaches at. */
export default function LocationsPanel({ addresses }: { addresses: Address[] }) {
  const { t, locale } = useI18n();
  if (addresses.length === 0) return null;

  return (
    <section className="rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <h2 className="mb-3 font-bold">{t('detail.locations')}</h2>
      <ul className="flex flex-col gap-1">
        {addresses.map((a) => (
          <li key={a.id} className="flex gap-3 rounded p-2">
            <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
              <MapPinIcon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium">
                {provinceName(a.province, locale)}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {a.line}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
