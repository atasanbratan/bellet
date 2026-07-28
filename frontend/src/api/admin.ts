import api from './client';
import type {
  AdminStats,
  AdminUser,
  Business,
  BusinessStatus,
  Gateway,
  Paginated,
  PaymentFilters,
  PaymentsPage,
} from '../types';
import { tableParams, type TableRequest } from '../lib/usePagedTable';

// Single place for all admin HTTP calls.
export const adminApi = {
  getStats: () => api.get<AdminStats>('/admin/stats').then((r) => r.data),

  listUsers: (page: number, pageSize: number) =>
    api
      .get<Paginated<AdminUser>>('/admin/users', { params: { page, pageSize } })
      .then((r) => r.data),

  listPayments: (req: TableRequest<PaymentFilters>) =>
    api
      .get<PaymentsPage>('/admin/payments', { params: tableParams(req) })
      .then((r) => r.data),

  listBusinesses: (status?: BusinessStatus) =>
    api
      .get<Business[]>('/admin/businesses', {
        params: status ? { status } : {},
      })
      .then((r) => r.data),

  approveBusiness: (id: string) =>
    api.patch(`/admin/businesses/${id}/approve`).then((r) => r.data),

  rejectBusiness: (id: string) =>
    api.patch(`/admin/businesses/${id}/reject`).then((r) => r.data),

  listGateways: () =>
    api.get<Gateway[]>('/admin/gateways').then((r) => r.data),
};
