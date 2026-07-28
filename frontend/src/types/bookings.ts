import type { Booking, Paginated } from '../types';

/** Column filters of the bookings data table (empty string = no filter). */
export interface BookingFilters {
  client: string;
  course: string;
  status: '' | Booking['status'];
  dateFrom: string;
  dateTo: string;
}

export interface BookingStats {
  count: number;
  confirmed: number;
  pending: number;
  cancelled: number;
}

export type BookingsPage = Paginated<Booking> & { stats: BookingStats };
