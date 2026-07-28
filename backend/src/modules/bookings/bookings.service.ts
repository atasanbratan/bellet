import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { BusinessesService } from '../businesses/businesses.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingsDto } from './dto/query-bookings.dto';
import { buildBookingsWhere } from './bookings-where';
import { enrollmentClosedCode } from '../offerings/group-dates';

const groupInclude = { include: { teacher: true } } as const;

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly payments: PaymentsService,
    private readonly businesses: BusinessesService,
  ) {}

  async create(clientId: string, dto: CreateBookingDto) {
    const offering = await this.prisma.offering.findUnique({
      where: { id: dto.offeringId },
    });
    if (!offering) throw new NotFoundException('Offering not found');

    if (dto.groupId) {
      const group = await this.prisma.group.findUnique({
        where: { id: dto.groupId },
      });
      if (!group || group.offeringId !== offering.id) {
        throw new BadRequestException('Invalid group for this offering');
      }
      // Enrollment window (kabul edilişik) — reject outside A→B.
      const closed = enrollmentClosedCode(group.enrollFrom, group.enrollUntil);
      if (closed) {
        throw new BadRequestException({ code: closed, message: 'Enrollment closed' });
      }
      // Enforce capacity (0 = unlimited).
      if (group.capacity > 0) {
        const taken = await this.prisma.booking.count({
          where: {
            groupId: group.id,
            status: { not: BookingStatus.CANCELLED },
          },
        });
        if (taken >= group.capacity) {
          throw new BadRequestException({ code: 'GROUP_FULL', message: 'This group is full' });
        }
      }
    }

    const booking = await this.prisma.booking.create({
      data: {
        clientId,
        offeringId: offering.id,
        groupId: dto.groupId ?? null,
      },
    });

    // Kick off the prepayment (awans) through the active payment provider.
    const { payment, redirectUrl } = await this.payments.createForBooking(
      booking.id,
      Number(offering.prepaymentAmount),
    );

    return { booking, payment, redirectUrl };
  }

  findMine(clientId: string) {
    return this.prisma.booking.findMany({
      where: { clientId },
      include: {
        offering: { include: { business: true } },
        group: groupInclude,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findForBusiness(ownerId: string, businessId: string) {
    await this.businesses.assertOwner(ownerId, businessId);
    return this.prisma.booking.findMany({
      where: { offering: { businessId } },
      include: {
        client: { select: { id: true, name: true, phone: true } },
        offering: true,
        group: groupInclude,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Owner bookings data table: filterable, paginated, newest first, plus
   * per-status counts over the filtered set.
   */
  async findPaginated(query: QueryBookingsDto, businessId: string) {
    const where = buildBookingsWhere(query, businessId);
    const { page, pageSize } = query;
    const [items, total, byStatus] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where,
        include: {
          client: { select: { id: true, name: true, phone: true } },
          offering: {
            select: {
              id: true,
              title: true,
              titleTk: true,
              titleEn: true,
              titleRu: true,
            },
          },
          group: {
            select: {
              id: true,
              days: true,
              timeOfDay: true,
              startTime: true,
              endTime: true,
            },
          },
          payment: { select: { id: true, amount: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.booking.count({ where }),
      this.prisma.booking.groupBy({
        by: ['status'],
        where,
        orderBy: { status: 'asc' },
        _count: true,
      }),
    ]);
    const statusCount = (s: BookingStatus) =>
      byStatus.find((r) => r.status === s)?._count ?? 0;
    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      stats: {
        count: total,
        confirmed: statusCount(BookingStatus.CONFIRMED),
        pending: statusCount(BookingStatus.PENDING),
        cancelled: statusCount(BookingStatus.CANCELLED),
      },
    };
  }

  async cancel(clientId: string, id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.clientId !== clientId) {
      throw new ForbiddenException('Not your booking');
    }
    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
  }
}
