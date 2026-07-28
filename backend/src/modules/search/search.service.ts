import { Injectable } from '@nestjs/common';
import { BusinessStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const LIMIT = 5;

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  /** Global search across approved businesses, their courses and teachers. */
  async search(q: string) {
    const query = q.trim();
    if (query.length < 2) {
      return { businesses: [], courses: [], teachers: [] };
    }
    const contains = { contains: query, mode: 'insensitive' as const };

    const [businesses, courses, teachers] = await Promise.all([
      this.prisma.business.findMany({
        where: {
          status: BusinessStatus.APPROVED,
          OR: [
            { name: contains },
            { description: contains },
            { descriptionTk: contains },
            { descriptionEn: contains },
            { descriptionRu: contains },
          ],
        },
        select: {
          id: true,
          name: true,
          photos: true,
          category: { select: { slug: true, name: true } },
        },
        take: LIMIT,
      }),
      this.prisma.offering.findMany({
        where: {
          business: { status: BusinessStatus.APPROVED },
          OR: [
            { title: contains },
            { titleTk: contains },
            { titleEn: contains },
            { titleRu: contains },
            { description: contains },
            { descriptionTk: contains },
            { descriptionEn: contains },
            { descriptionRu: contains },
          ],
        },
        select: {
          id: true,
          title: true,
          titleTk: true,
          titleEn: true,
          titleRu: true,
          price: true,
          business: { select: { id: true, name: true } },
        },
        take: LIMIT,
      }),
      this.prisma.teacher.findMany({
        where: {
          business: { status: BusinessStatus.APPROVED },
          name: contains,
        },
        select: {
          id: true,
          name: true,
          photo: true,
          business: { select: { id: true, name: true } },
        },
        take: LIMIT,
      }),
    ]);

    return { businesses, courses, teachers };
  }
}
