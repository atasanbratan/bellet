import { Injectable } from '@nestjs/common';
import { BusinessStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/** Course subjects (Language, IT, Math…) — the public browse filter. */
@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * All subjects, each with how many approved centers teach it — the browse
   * sidebar shows the count and can grey out empty ones.
   */
  async findAll() {
    const subjects = await this.prisma.subject.findMany({
      orderBy: { slug: 'asc' },
      include: {
        offerings: {
          where: { business: { status: BusinessStatus.APPROVED } },
          select: { businessId: true },
        },
      },
    });
    return subjects.map(({ offerings, ...subject }) => ({
      ...subject,
      businessCount: new Set(offerings.map((o) => o.businessId)).size,
    }));
  }
}
