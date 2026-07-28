import { Injectable } from '@nestjs/common';
import {
  BookingStatus,
  BusinessStatus,
  PaymentStatus,
  Role,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async overview() {
    const [
      users,
      admins,
      owners,
      clients,
      businesses,
      pending,
      approved,
      rejected,
      courses,
      bookings,
      confirmed,
      revenue,
    ] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: Role.ADMIN } }),
      this.prisma.user.count({ where: { role: Role.OWNER } }),
      this.prisma.user.count({ where: { role: Role.CLIENT } }),
      this.prisma.business.count(),
      this.prisma.business.count({ where: { status: BusinessStatus.PENDING } }),
      this.prisma.business.count({ where: { status: BusinessStatus.APPROVED } }),
      this.prisma.business.count({ where: { status: BusinessStatus.REJECTED } }),
      this.prisma.offering.count(),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: PaymentStatus.PAID },
      }),
    ]);

    return {
      users: { total: users, admins, owners, clients },
      businesses: { total: businesses, pending, approved, rejected },
      courses,
      bookings: { total: bookings, confirmed },
      revenue: Number(revenue._sum.amount ?? 0),
    };
  }
}
