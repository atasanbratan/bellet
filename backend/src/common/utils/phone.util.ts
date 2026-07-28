/** Normalize a phone number for consistent storage/matching (strip whitespace). */
export function normalizePhone(input: string): string {
  return input.trim().replace(/\s+/g, '');
}
