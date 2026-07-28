import { useI18n } from '../../i18n/LocaleContext';
import { filterInputCls as inputCls } from '../../lib/usePagedTable';
import type { BookingFilters } from '../../types';

const STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const;

/** Per-column filter inputs rendered as the second header row of the table. */
export default function BookingFilterRow({
  filters,
  onChange,
}: {
  filters: BookingFilters;
  onChange: (f: BookingFilters) => void;
}) {
  const { t } = useI18n();
  const set = (patch: Partial<BookingFilters>) =>
    onChange({ ...filters, ...patch });

  return (
    <tr className="border-t border-slate-100 dark:border-slate-800">
      <th className="px-4 pb-3 pt-1">
        <input
          className={inputCls}
          placeholder={t('filter.search')}
          value={filters.client}
          onChange={(e) => set({ client: e.target.value })}
        />
      </th>
      <th className="px-4 pb-3 pt-1">
        <input
          className={inputCls}
          placeholder={t('filter.search')}
          value={filters.course}
          onChange={(e) => set({ course: e.target.value })}
        />
      </th>
      <th className="px-4 pb-3 pt-1" />
      <th className="px-4 pb-3 pt-1">
        <select
          className={inputCls}
          value={filters.status}
          onChange={(e) =>
            set({ status: e.target.value as BookingFilters['status'] })
          }
        >
          <option value="">{t('filter.any')}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`status.${s}`)}
            </option>
          ))}
        </select>
      </th>
      <th className="px-4 pb-3 pt-1" />
      <th className="px-4 pb-3 pt-1">
        <div className="flex flex-col gap-1">
          <input
            type="date"
            className={inputCls}
            title={t('filter.from')}
            value={filters.dateFrom}
            onChange={(e) => set({ dateFrom: e.target.value })}
          />
          <input
            type="date"
            className={inputCls}
            title={t('filter.to')}
            value={filters.dateTo}
            onChange={(e) => set({ dateTo: e.target.value })}
          />
        </div>
      </th>
    </tr>
  );
}
