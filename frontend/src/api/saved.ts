import api from './client';
import type { Business } from '../types';

/** Centres the signed-in user has bookmarked. */
export const savedApi = {
  /** Ids only — enough to mark hearts across the browse grid. */
  listIds: () => api.get<string[]>('/me/saved/ids').then((r) => r.data),

  list: () => api.get<Business[]>('/me/saved').then((r) => r.data),

  save: (businessId: string) =>
    api.post(`/businesses/${businessId}/save`).then((r) => r.data),

  remove: (businessId: string) =>
    api.delete(`/businesses/${businessId}/save`).then((r) => r.data),
};
