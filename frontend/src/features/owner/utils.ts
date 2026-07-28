import api from '../../api/client';

/** True when the API refused because the record still has bookings (409). */
export function isConflict(e: unknown): boolean {
  return (
    (e as { response?: { status?: number } })?.response?.status === 409
  );
}

/** Multipart upload of a single image to the given endpoint. */
export async function uploadImage(url: string, file: File) {
  const fd = new FormData();
  fd.append('file', file);
  await api.post(url, fd);
}
