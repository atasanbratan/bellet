import { Injectable } from '@nestjs/common';
import { BookingStatus, PaymentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 30;

/**
 * Percentage change between two periods. Returns null when the earlier period
 * was empty — a change "from zero" has no meaningful percentage, and showing
 * +100% there would overstate it.
 */
function deltaPct(recent: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Math.round(((recent - previous) / previous) * 100);
}

const empty = {
  revenue: { total: 0, deltaPct: null as number | null },
  bookings: { total: 0, deltaPct: null as number | null },
  students: 0,
  courses: 0,
  teachers: 0,
  windowDays: WINDOW_DAYS,
};

/** Headline numbers for the owner's dashboard overview. */
@Injectable()
export class OwnerStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async overview(ownerId: string) {
    const business = await this.prisma.business.findUnique({
      where: { ownerId },
      select: { id: true },
    });
    if (!business) return empty;

    const now = Date.now();
    const since = new Date(now - WINDOW_DAYS * DAY_MS);
    const previousSince = new Date(now - 2 * WINDOW_DAYS * DAY_MS);

    const ofBusiness: Prisma.BookingWhereInput = {
      offering: { businessId: business.id },
    };
    const paidOfBusiness: Prisma.PaymentWhereInput = {
      status: PaymentStatus.PAID,
      booking: ofBusiness,
    };

    const [
      revenueTotal,
      revenueRecent,
      revenuePrevious,
      bookingsTotal,
      bookingsRecent,
      bookingsPrevious,
      students,
      courses,
      teachers,
    ] = await this.prisma.$transaction([
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: paidOfBusiness,
      }),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { ...paidOfBusiness, createdAt: { gte: since } },
      }),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          ...paidOfBusiness,
          createdAt: { gte: previousSince, lt: since },
        },
      }),
      this.prisma.booking.count({ where: ofBusiness }),
      this.prisma.booking.count({
        where: { ...ofBusiness, createdAt: { gte: since } },
      }),
      this.prisma.booking.count({
        where: { ...ofBusiness, createdAt: { gte: previousSince, lt: since } },
      }),
      // "Students" = distinct clients holding a live booking.
      this.prisma.booking.findMany({
        where: { ...ofBusiness, status: { not: BookingStatus.CANCELLED } },
        select: { clientId: true },
        distinct: ['clientId'],
      }),
      this.prisma.offering.count({ where: { businessId: business.id } }),
      this.prisma.teacher.count({ where: { businessId: business.id } }),
    ]);

    const sum = (agg: { _sum: { amount: Prisma.Decimal | null } }) =>
      Number(agg._sum.amount ?? 0);

    return {
      revenue: {
        total: sum(revenueTotal),
        deltaPct: deltaPct(sum(revenueRecent), sum(revenuePrevious)),
      },
      bookings: {
        total: bookingsTotal,
        deltaPct: deltaPct(bookingsRecent, bookingsPrevious),
      },
      students: students.length,
      courses,
      teachers,
      windowDays: WINDOW_DAYS,
    };
  }
}
