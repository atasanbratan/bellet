/** Admin-only views: user directory, SMS gateways, platform-wide stats. */
import type { Role } from '../types';

export interface AdminUser {
  id: string;
  name?: string | null;
  phone: string;
  email?: string | null;
  role: Role;
  phoneVerified: boolean;
  createdAt: string;
}

export interface Gateway {
  id: string;
  phoneNumber: string;
  lastSeenAt: string;
  online: boolean;
}

export interface AdminStats {
  users: { total: number; admins: number; owners: number; clients: number };
  businesses: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  courses: number;
  bookings: { total: number; confirmed: number };
  revenue: number;
}

/** Owner dashboard headline numbers. `deltaPct` is null when the previous
 *  window was empty — a % change from zero isn't meaningful. */
export interface OwnerStats {
  revenue: { total: number; deltaPct: number | null };
  bookings: { total: number; deltaPct: number | null };
  students: number;
  courses: number;
  teachers: number;
  windowDays: number;
}
