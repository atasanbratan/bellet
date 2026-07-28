import { Injectable, NotFoundException } from '@nestjs/common';
import { BusinessStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/** Centres a client has bookmarked to come back to. */
@Injectable()
export class SavedService {
  constructor(private readonly prisma: PrismaService) {}

  /** Idempotent: saving an already-saved centre is a no-op, not a 409. */
  async save(userId: string, businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, status: true },
    });
    // Don't let unapproved centres be bookmarked into existence.
    if (!business || business.status !== BusinessStatus.APPROVED) {
      throw new NotFoundException('Business not found');
    }
    await this.prisma.savedCenter.upsert({
      where: { userId_businessId: { userId, businessId } },
      update: {},
      create: { userId, businessId },
    });
    return { saved: true };
  }

  /** Also idempotent — removing something not saved is fine. */
  async remove(userId: string, businessId: string) {
    await this.prisma.savedCenter.deleteMany({ where: { userId, businessId } });
    return { saved: false };
  }

  /** Just the ids, so the browse grid can mark hearts without refetching cards. */
  async listIds(userId: string) {
    const rows = await this.prisma.savedCenter.findMany({
      where: { userId },
      select: { businessId: true },
    });
    return rows.map((r) => r.businessId);
  }

  /** Full cards for the "Saved" page, in the browse card's shape. */
  async list(userId: string) {
    const rows = await this.prisma.savedCenter.findMany({
      where: { userId, business: { status: BusinessStatus.APPROVED } },
      orderBy: { createdAt: 'desc' },
      include: {
        business: {
          include: {
            category: true,
            addresses: { include: { province: true } },
            offerings: { select: { subjects: true } },
            _count: { select: { offerings: true } },
          },
        },
      },
    });

    return rows.map(({ business }) => {
      const { offerings, ...rest } = business;
      return {
        ...rest,
        subjects: [
          ...new Map(
            offerings.flatMap((o) => o.subjects).map((s) => [s.id, s]),
          ).values(),
        ],
      };
    });
  }
}
