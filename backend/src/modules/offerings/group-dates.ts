import { BadRequestException } from '@nestjs/common';

/** The calendar fields a group can carry: start, length, enrollment window. */
export interface GroupDateInput {
  startDate?: string | null;
  durationWeeks?: number | null;
  enrollFrom?: string | null;
  enrollUntil?: string | null;
}

/** 'YYYY-MM-DD' → Date; blank/absent leaves the field untouched (Prisma undefined). */
function toDate(v?: string | null): Date | undefined {
  return v ? new Date(v) : undefined;
}

/**
 * A Prisma data fragment for the group date columns. A field left blank is
 * `undefined`, so it's ignored on update (keeps the current value) and falls to
 * the column default on create — bulk apply never clobbers an unfilled field.
 */
export function groupDatesData(dto: GroupDateInput) {
  return {
    startDate: toDate(dto.startDate),
    durationWeeks: dto.durationWeeks ?? undefined,
    enrollFrom: toDate(dto.enrollFrom),
    enrollUntil: toDate(dto.enrollUntil),
  };
}

/** Enrollment can't close before it opens (only checked when both are given). */
export function assertEnrollWindow(from?: string | null, until?: string | null) {
  if (from && until && new Date(from) > new Date(until)) {
    throw new BadRequestException('Enrollment start must be on or before its end');
  }
}

/** Turkmenistan Standard Time (UTC+5, no DST) — the owner's calendar day. */
export const APP_TZ = 'Asia/Ashgabat';

/** 'YYYY-MM-DD' for an instant in the app's local time, not the server's UTC. */
export function localDay(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: APP_TZ }).format(now);
}

/**
 * Why "today" can't book this group, or null if it can. Compared as calendar
 * days in local time (Asia/Ashgabat) so both ends of the window are inclusive
 * and don't flip a few hours early/late on a UTC server.
 */
export function enrollmentClosedCode(
  enrollFrom: Date | null,
  enrollUntil: Date | null,
  now: Date = new Date(),
): 'ENROLL_NOT_OPEN' | 'ENROLL_CLOSED' | null {
  const today = localDay(now);
  if (enrollFrom && today < enrollFrom.toISOString().slice(0, 10)) {
    return 'ENROLL_NOT_OPEN';
  }
  if (enrollUntil && today > enrollUntil.toISOString().slice(0, 10)) {
    return 'ENROLL_CLOSED';
  }
  return null;
}
