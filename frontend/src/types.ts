/**
 * Shared API types. Domain groups live in `types/*`; this file is the barrel
 * everything imports from, plus the few cross-cutting types.
 */

export type Role = 'ADMIN' | 'OWNER' | 'CLIENT';

export interface Payment {
  id: string;
  amount: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
}

export interface Booking {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  offering?: Offering & { business?: Business };
  group?: Group | null;
  payment?: Payment | null;
  client?: { id: string; name?: string | null; phone: string };
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  userId: string;
  role: Role;
  phone: string;
  /** Optional at registration, so the UI must cope with it being absent. */
  name?: string | null;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

import type { Business, Group, Offering } from './types/catalog';

export type {
  Address,
  Business,
  BusinessDetail,
  BusinessStatus,
  Category,
  Group,
  I18nText,
  Offering,
  Province,
  Subject,
  Teacher,
  TimeOfDay,
} from './types/catalog';
export type { AdminStats, AdminUser, Gateway, OwnerStats } from './types/admin';
export type {
  AdminPayment,
  PaymentFilters,
  PaymentStats,
  PaymentsPage,
} from './types/payments';
export type {
  BookingFilters,
  BookingStats,
  BookingsPage,
} from './types/bookings';
