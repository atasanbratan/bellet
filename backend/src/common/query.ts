import { Prisma } from '@prisma/client';

/** Case-insensitive substring match for Prisma string filters. */
export const insensitive = (value: string) => ({
  contains: value,
  mode: Prisma.QueryMode.insensitive,
});

/** Inclusive createdAt range from optional ISO dates (whole "to" day). */
export function createdAtRange(dateFrom?: string, dateTo?: string) {
  if (!dateFrom && !dateTo) return undefined;
  const createdAt: Prisma.DateTimeFilter = {};
  if (dateFrom) createdAt.gte = new Date(dateFrom);
  if (dateTo) createdAt.lte = new Date(`${dateTo.slice(0, 10)}T23:59:59.999Z`);
  return createdAt;
}

/** Course-title match across the base column and all language variants. */
export const titleContains = (value: string): Prisma.OfferingWhereInput => ({
  OR: (['title', 'titleTk', 'titleEn', 'titleRu'] as const).map((f) => ({
    [f]: insensitive(value),
  })),
});

/** Client match on name or phone. */
export const clientContains = (value: string): Prisma.UserWhereInput => ({
  OR: [{ name: insensitive(value) }, { phone: insensitive(value) }],
});
