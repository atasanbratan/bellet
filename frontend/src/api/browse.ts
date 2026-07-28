import api from './client';
import type { Business, Paginated } from '../types';

export interface BrowseQuery {
  search?: string;
  province?: string;
  subject?: string;
  page?: number;
  pageSize?: number;
}

/** Public centre browse — paginated, filterable by subject and region. */
export const browseApi = {
  list: (q: BrowseQuery) =>
    api
      .get<Paginated<Business>>('/businesses', {
        params: {
          ...(q.search ? { search: q.search } : {}),
          ...(q.province ? { province: q.province } : {}),
          ...(q.subject ? { subject: q.subject } : {}),
          ...(q.page ? { page: q.page } : {}),
          ...(q.pageSize ? { pageSize: q.pageSize } : {}),
        },
      })
      .then((r) => r.data),
};
