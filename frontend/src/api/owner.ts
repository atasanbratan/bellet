import api from './client';
import { tableParams, type TableRequest } from '../lib/usePagedTable';
import type {
  BookingFilters,
  BookingsPage,
  OwnerStats,
  PaymentFilters,
  PaymentsPage,
} from '../types';

/** Owner endpoints — always scoped to the logged-in owner's business. */
export const ownerApi = {
  listPayments: (req: TableRequest<PaymentFilters>) =>
    api
      .get<PaymentsPage>('/owner/payments', { params: tableParams(req) })
      .then((r) => r.data),

  listBookings: (req: TableRequest<BookingFilters>) =>
    api
      .get<BookingsPage>('/owner/bookings', { params: tableParams(req) })
      .then((r) => r.data),

  stats: () => api.get<OwnerStats>('/owner/stats').then((r) => r.data),
};
