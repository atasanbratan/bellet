import { useI18n } from '../../i18n/LocaleContext';
import type { AdminPayment, PaymentFilters } from '../../types';
import TablePager from '../../components/TablePager';
import FilterRow from './FilterRow';
import PaymentRow from './PaymentRow';

interface Props {
  items: AdminPayment[];
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  filters: PaymentFilters;
  showBusiness: boolean;
  onPage: (page: number) => void;
  onFilters: (f: PaymentFilters) => void;
}

/** Data table with a filter input under every column header. */
export default function PaymentsTable({
  items,
  page,
  totalPages,
  total,
  loading,
  filters,
  showBusiness,
  onPage,
  onFilters,
}: Props) {
  const { t } = useI18n();
  const columns = showBusiness ? 6 : 5;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-4 pb-1 pt-3 font-medium">{t('table.client')}</th>
              <th className="px-4 pb-1 pt-3 font-medium">{t('table.course')}</th>
              {showBusiness && (
                <th className="px-4 pb-1 pt-3 font-medium">{t('table.center')}</th>
              )}
              <th className="px-4 pb-1 pt-3 font-medium">{t('table.amount')}</th>
              <th className="px-4 pb-1 pt-3 font-medium">{t('table.status')}</th>
              <th className="px-4 pb-1 pt-3 font-medium">{t('table.date')}</th>
            </tr>
            <FilterRow
              filters={filters}
              showBusiness={showBusiness}
              onChange={onFilters}
            />
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((p) => (
              <PaymentRow key={p.id} payment={p} showBusiness={showBusiness} />
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={columns} className="px-4 py-10 text-center text-slate-400">
                  {t('admin.empty')}
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
