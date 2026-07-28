import api from './client';
import type { Subject } from '../types';

export const subjectsApi = {
  /** All subjects with a count of approved centres teaching each. */
  list: () => api.get<Subject[]>('/subjects').then((r) => r.data),
};
