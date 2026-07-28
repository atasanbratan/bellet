import type { PaymentFilters, PaymentsPage } from '../../types';
import { usePagedTable, type TableRequest } from '../../lib/usePagedTable';

export const EMPTY_FILTERS: PaymentFilters = {
  client: '',
  course: '',
  business: '',
  status: '',
  dateFrom: '',
  dateTo: '',
};

const EMPTY_PAGE: PaymentsPage = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  stats: { count: 0, totalAmount: 0, paidCount: 0, paidAmount: 0 },
};

/** Payments table state; `fetchPage` picks the admin or owner endpoint. */
export function usePayments(
  fetchPage: (req: TableRequest<PaymentFilters>) => Promise<PaymentsPage>,
) {
  return usePagedTable(fetchPage, EMPTY_FILTERS, EMPTY_PAGE);
}
