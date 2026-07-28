import { Prisma } from '@prisma/client';
import {
  clientContains,
  createdAtRange,
  insensitive,
  titleContains,
} from '../../common/query';
import { QueryPaymentsDto } from './dto/query-payments.dto';

/**
 * Builds the Prisma `where` for the payments table from the column filters.
 * `businessId` (owner scope) is enforced on top of whatever was queried.
 */
export function buildPaymentsWhere(
  q: QueryPaymentsDto,
  businessId?: string,
): Prisma.PaymentWhereInput {
  const offering: Prisma.OfferingWhereInput[] = [];
  if (businessId) offering.push({ businessId });
  if (q.course) offering.push(titleContains(q.course));
  if (q.business) {
    offering.push({ business: { name: insensitive(q.business) } });
  }

  const booking: Prisma.BookingWhereInput = {};
  if (q.client) booking.client = clientContains(q.client);
  if (offering.length) booking.offering = { AND: offering };

  const createdAt = createdAtRange(q.dateFrom, q.dateTo);

  return {
    ...(q.status ? { status: q.status } : {}),
    ...(createdAt ? { createdAt } : {}),
    ...(Object.keys(booking).length ? { booking } : {}),
  };
}
