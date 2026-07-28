import { Injectable } from '@nestjs/common';
import { BusinessStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/** Turkmenistan's welayats + the capital — a fixed, seeded lookup table. */
@Injectable()
export class ProvincesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Each welayat with how many approved centres have a building there, so the
   * region filter can show counts and dim the ones that would return nothing.
   */
  async findAll() {
    const provinces = await this.prisma.province.findMany({
      orderBy: { slug: 'asc' },
      include: {
        addresses: {
          where: { business: { status: BusinessStatus.APPROVED } },
          select: { businessId: true },
        },
      },
    });
    return provinces.map(({ addresses, ...province }) => ({
      ...province,
      // A centre with two buildings in one welayat still counts once.
      businessCount: new Set(addresses.map((a) => a.businessId)).size,
    }));
  }
}
