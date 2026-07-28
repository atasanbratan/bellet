import api from './client';
import type { Address } from '../types';

export interface AddressInput {
  provinceId: string;
  line: string;
}

/** Owner-managed physical locations of the logged-in owner's business. */
export const addressesApi = {
  list: (businessId: string) =>
    api.get<Address[]>(`/businesses/${businessId}/addresses`).then((r) => r.data),

  create: (businessId: string, dto: AddressInput) =>
    api
      .post<Address>(`/businesses/${businessId}/addresses`, dto)
      .then((r) => r.data),

  update: (businessId: string, addressId: string, dto: AddressInput) =>
    api
      .patch<Address>(`/businesses/${businessId}/addresses/${addressId}`, dto)
      .then((r) => r.data),

  remove: (businessId: string, addressId: string) =>
    api.delete(`/businesses/${businessId}/addresses/${addressId}`),
};
