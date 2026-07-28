/** Date helpers shared by the group date fields and their public display. */

/** Turkmenistan Standard Time (UTC+5, no DST) — the app's canonical calendar day. */
export const APP_TZ = 'Asia/Ashgabat';

/** 'YYYY-MM-DD' for an instant in the app's local time, regardless of viewer TZ. */
export function todayLocal(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: APP_TZ }).format(now);
}

/** ISO (or any Date-parseable) → 'YYYY-MM-DD' for <input type="date"> values. */
export function toDateInput(iso?: string | null): string {
  return iso ? iso.slice(0, 10) : '';
}

/** ISO → a locale-formatted calendar date, or '' when absent. */
export function formatDate(iso: string | null | undefined, locale: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(locale);
}

/** The course's end date, derived from its start + duration in weeks. */
export function courseEndDate(
  startDate: string | null | undefined,
  durationWeeks: number | null | undefined,
): Date | null {
  if (!startDate || !durationWeeks) return null;
  const end = new Date(startDate);
  end.setDate(end.getDate() + durationWeeks * 7);
  return end;
}
