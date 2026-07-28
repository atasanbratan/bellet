import { useI18n } from '../../i18n/LocaleContext';
import TablePager from '../../components/TablePager';
import type { Booking, BookingFilters } from '../../types';
import BookingFilterRow from './BookingFilterRow';
import BookingRow from './BookingRow';

interface Props {
  items: Booking[];
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  filters: BookingFilters;
  onPage: (page: number) => void;
  onFilters: (f: BookingFilters) => void;
}

/** Bookings data table with a filter input under every column header. */
export default function BookingsTable({
  items,
  page,
  totalPages,
  total,
  loading,
  filters,
  onPage,
  onFilters,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-4 pb-1 pt-3 font-medium">{t('table.client')}</th>
              <th className="px-4 pb-1 pt-3 font-medium">{t('table.course')}</th>
              <th className="px-4 pb-1 pt-3 font-medium">{t('table.group')}</th>
              <th className="px-4 pb-1 pt-3 font-medium">{t('table.status')}</th>
              <th className="px-4 pb-1 pt-3 font-medium">{t('table.payment')}</th>
              <th className="px-4 pb-1 pt-3 font-medium">{t('table.date')}</th>
            </tr>
            <BookingFilterRow filters={filters} onChange={onFilters} />
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((b) => (
              <BookingRow key={b.id} booking={b} />
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  {t('dash.no_bookings')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TablePager
        page={page}
        totalPages={totalPages}
        total={total}
        loading={loading}
        onPage={onPage}
      />
    </div>
  );
}
