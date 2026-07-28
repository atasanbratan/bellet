import type { BookingFilters, BookingsPage } from '../../types';
import { usePagedTable, type TableRequest } from '../../lib/usePagedTable';

export const EMPTY_FILTERS: BookingFilters = {
  client: '',
  course: '',
  status: '',
  dateFrom: '',
  dateTo: '',
};

const EMPTY_PAGE: BookingsPage = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  stats: { count: 0, confirmed: 0, pending: 0, cancelled: 0 },
};

/** Bookings table state for the owner dashboard. */
export function useBookings(
  fetchPage: (req: TableRequest<BookingFilters>) => Promise<BookingsPage>,
) {
  return usePagedTable(fetchPage, EMPTY_FILTERS, EMPTY_PAGE);
}
