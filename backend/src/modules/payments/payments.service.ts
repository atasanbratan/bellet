import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  PAYMENT_PROVIDER,
  PaymentProvider,
} from './payment-provider.interface';
import { MockPaymentProvider } from './mock-payment.provider';
import { QueryPaymentsDto } from './dto/query-payments.dto';
import { buildPaymentsWhere } from './payments-where';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(PAYMENT_PROVIDER) private readonly provider: PaymentProvider,
  ) {}

  /**
   * Filterable payments table, newest first, with client/course/center
   * context. Admin sees everything; owners pass their businessId scope.
   * Also returns aggregate stats (count / total / paid) over the filtered set.
   */
  async findPaginated(query: QueryPaymentsDto, businessId?: string) {
    const where = buildPaymentsWhere(query, businessId);
    const { page, pageSize } = query;
    const [items, total, sums, paid] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where,
        select: {
          id: true,
          amount: true,
          provider: true,
          status: true,
          createdAt: true,
          booking: {
            select: {
              id: true,
              status: true,
              client: { select: { id: true, name: true, phone: true } },
              offering: {
                select: {
                  id: true,
                  title: true,
                  titleTk: true,
                  titleEn: true,
                  titleRu: true,
                  business: { select: { id: true, name: true } },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.payment.count({ where }),
      this.prisma.payment.aggregate({ where, _sum: { amount: true } }),
      this.prisma.payment.aggregate({
        where: { AND: [where, { status: PaymentStatus.PAID }] },
        _sum: { amount: true },
        _count: true,
      }),
    ]);
    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      stats: {
        count: total,
        totalAmount: sums._sum.amount ?? 0,
        paidCount: paid._count,
        paidAmount: paid._sum.amount ?? 0,
      },
    };
  }

  /** Create a pending payment for a booking through the active provider. */
  async createForBooking(bookingId: string, amount: number) {
    const result = await this.provider.createPayment({ bookingId, amount });
    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        amount,
        provider: this.provider.name,
        status: PaymentStatus.PENDING,
        externalRef: result.externalRef,
      },
    });
    return { payment, redirectUrl: result.redirectUrl };
  }

  /**
   * Dev-only: simulate the bank settling a payment. On PAID the booking is
   * confirmed; on FAILED it is left pending so the client can retry.
   */
  async simulate(paymentId: string, outcome: 'PAID' | 'FAILED') {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    if (payment.externalRef && this.provider instanceof MockPaymentProvider) {
      this.provider.settle(payment.externalRef, outcome);
    }

    const status =
      outcome === 'PAID' ? PaymentStatus.PAID : PaymentStatus.FAILED;
    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status },
    });

    if (outcome === 'PAID') {
      await this.prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: BookingStatus.CONFIRMED },
      });
    }
    return updated;
  }
}
