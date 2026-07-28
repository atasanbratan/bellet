import type { Group } from '../types';
import { todayLocal } from './dates';

/** Where "today" sits relative to a group's enrollment window (kabul edilişik). */
export type EnrollmentStatus = 'none' | 'not_open' | 'open' | 'closed';

type Window = Pick<Group, 'enrollFrom' | 'enrollUntil'>;

/**
 * Mirrors the backend booking check (offerings/group-dates.ts): compared as
 * calendar days in local time (Asia/Ashgabat) so both ends are inclusive.
 * 'none' = no window, always bookable.
 */
export function enrollmentStatus(g: Window, now: Date = new Date()): EnrollmentStatus {
  if (!g.enrollFrom && !g.enrollUntil) return 'none';
  const today = todayLocal(now);
  if (g.enrollFrom && today < g.enrollFrom.slice(0, 10)) return 'not_open';
  if (g.enrollUntil && today > g.enrollUntil.slice(0, 10)) return 'closed';
  return 'open';
}

/** Can this group be booked right now? (window open, or no window at all) */
export function canEnroll(g: Window): boolean {
  const s = enrollmentStatus(g);
  return s === 'none' || s === 'open';
}
