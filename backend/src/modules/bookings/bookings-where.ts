import { Prisma } from '@prisma/client';
import {
  clientContains,
  createdAtRange,
  titleContains,
} from '../../common/query';
import { QueryBookingsDto } from './dto/query-bookings.dto';

/**
 * Builds the Prisma `where` for the owner bookings table: always scoped to
 * the owner's business, then narrowed by the column filters.
 */
export function buildBookingsWhere(
  q: QueryBookingsDto,
  businessId: string,
): Prisma.BookingWhereInput {
  const offering: Prisma.OfferingWhereInput[] = [{ businessId }];
  if (q.course) offering.push(titleContains(q.course));

  const createdAt = createdAtRange(q.dateFrom, q.dateTo);

  return {
    offering: { AND: offering },
    ...(q.client ? { client: clientContains(q.client) } : {}),
    ...(q.status ? { status: q.status } : {}),
    ...(createdAt ? { createdAt } : {}),
  };
}
