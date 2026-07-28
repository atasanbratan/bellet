import type { TableRequest } from '../../lib/usePagedTable';
import type { PaymentFilters, PaymentsPage } from '../../types';
import { usePayments } from './usePayments';
import PaymentsStats from './PaymentsStats';
import PaymentsTable from './PaymentsTable';

/**
 * Full payments data table (stats + column filters + pagination), shared by
 * the admin (all payments) and owner (own business) dashboards.
 */
export default function PaymentsPanel({
  fetchPage,
  showBusiness = false,
}: {
  fetchPage: (req: TableRequest<PaymentFilters>) => Promise<PaymentsPage>;
  showBusiness?: boolean;
}) {
  const { data, loading, page, setPage, filters, setFilters } =
    usePayments(fetchPage);

  return (
    <div>
      <PaymentsStats stats={data.stats} />
      <PaymentsTable
        items={data.items}
        page={page}
        totalPages={data.totalPages}
        total={data.total}
        loading={loading}
        filters={filters}
        showBusiness={showBusiness}
        onPage={setPage}
        onFilters={setFilters}
      />
    </div>
  );
}
