import type { Booking, I18nText, Paginated, Payment } from '../types';

/** A payment row in the admin/owner tables, with booking context. */
export interface AdminPayment {
  id: string;
  amount: string;
  provider: string;
  status: Payment['status'];
  createdAt: string;
  booking: {
    id: string;
    status: Booking['status'];
    client: { id: string; name?: string | null; phone: string };
    offering: I18nText & {
      id: string;
      title: string;
      business: { id: string; name: string };
    };
  };
}

/** Column filters of the payments data table (empty string = no filter). */
export interface PaymentFilters {
  client: string;
  course: string;
  business: string;
  status: '' | Payment['status'];
  dateFrom: string;
  dateTo: string;
}

export interface PaymentStats {
  count: number;
  totalAmount: number | string;
  paidCount: number;
  paidAmount: number | string;
}

export type PaymentsPage = Paginated<AdminPayment> & { stats: PaymentStats };
