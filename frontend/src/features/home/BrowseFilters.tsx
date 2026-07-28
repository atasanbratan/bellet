import type { Province } from '../../types';
import { useI18n } from '../../i18n/LocaleContext';
import { SearchIcon } from '../../components/visuals';
import RegionSelect from './RegionSelect';

/** Search + region, grouped into one bar above the results. */
export default function BrowseFilters({
  search,
  province,
  provinces,
  onSearch,
  onProvince,
}: {
  search: string;
  province: string;
  provinces: Province[];
  onSearch: (value: string) => void;
  onProvince: (value: string) => void;
}) {
  const { t } = useI18n();

  return (
    <div className="mb-5 flex flex-col gap-2 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 sm:flex-row">
      <div className="flex flex-1 items-center gap-2 rounded border border-transparent bg-slate-50 dark:bg-slate-800/60 px-3 focus-within:border-teal-500 focus-within:bg-white dark:focus-within:bg-slate-900">
        <SearchIcon className="h-4 w-4 flex-shrink-0 text-slate-400" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t('home.search_ph')}
          className="w-full bg-transparent py-2.5 text-sm outline-none"
        />
      </div>
      <RegionSelect
        provinces={provinces}
        value={province}
        onChange={onProvince}
      />
    </div>
  );
}
