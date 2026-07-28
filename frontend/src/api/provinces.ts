import api from './client';
import type { Province } from '../types';

export const provincesApi = {
  list: () => api.get<Province[]>('/provinces').then((r) => r.data),
};
