import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, BusinessStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { browsePaging, browseWhere, type BrowseParams } from './browse-query';

/** First non-empty trimmed string, or undefined. */
function firstText(...values: (string | undefined)[]) {
  for (const v of values) {
    const trimmed = v?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

function emptyToNull(v: string | undefined) {
  const trimmed = v?.trim();
  return trimmed ? trimmed : null;
}

/** First occurrence of each id, preserving order. */
function dedupeById<T extends { id: string }>(items: T[]): T[] {
  return [...new Map(items.map((i) => [i.id, i])).values()];
}

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Public browse (only APPROVED businesses) -----------------------------

  /** Paginated browse. Cards show the subjects the centre's courses cover. */
  async findAllPublic(params: BrowseParams) {
    const where = browseWhere(params);
    const { page, pageSize, skip, take } = browsePaging(params);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.business.findMany({
        where,
        skip,
        take,
        include: {
          category: true,
          addresses: { include: { province: true } },
          offerings: { select: { subjects: true } },
          _count: { select: { offerings: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.business.count({ where }),
    ]);

    return {
      items: items.map(({ offerings, ...business }) => ({
        ...business,
        // Flatten each centre's courses down to its distinct subject set.
        subjects: dedupeById(offerings.flatMap((o) => o.subjects)),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  // --- Admin ----------------------------------------------------------------

  adminList(status?: BusinessStatus) {
    return this.prisma.business.findMany({
      where: status ? { status } : undefined,
      include: {
        category: true,
        owner: { select: { id: true, name: true, phone: true } },
        _count: { select: { offerings: true } },
      },
      // Pending first, then newest.
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async setStatus(id: string, status: BusinessStatus) {
    const business = await this.prisma.business.findUnique({ where: { id } });
    if (!business) throw new NotFoundException('Business not found');
    return this.prisma.business.update({ where: { id }, data: { status } });
  }

  async findOnePublic(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        category: true,
        teachers: true,
        addresses: { include: { province: true } },
        offerings: {
          include: {
            subjects: true,
            groups: {
              include: {
                teacher: true,
                address: { include: { province: true } },
                // Active bookings per group → the UI shows seats left.
                _count: {
                  select: {
                    bookings: {
                      where: { status: { not: BookingStatus.CANCELLED } },
                    },
                  },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  // --- Owner ----------------------------------------------------------------

  /** The owner's single business (1:1), or null before they create one. */
  findMine(ownerId: string) {
    return this.prisma.business.findUnique({
      where: { ownerId },
      include: {
        category: true,
        addresses: { include: { province: true } },
        _count: { select: { offerings: true } },
      },
    });
  }

  async create(ownerId: string, dto: CreateBusinessDto) {
    const existing = await this.prisma.business.findUnique({
      where: { ownerId },
    });
    if (existing) {
      throw new ConflictException('Owner already has a business');
    }
    return this.prisma.business.create({
      data: {
        ownerId,
        categoryId: dto.categoryId,
        name: dto.name,
        description:
          firstText(
            dto.descriptionTk,
            dto.descriptionEn,
            dto.descriptionRu,
            dto.description,
          ) ?? null,
        descriptionTk: emptyToNull(dto.descriptionTk),
        descriptionEn: emptyToNull(dto.descriptionEn),
        descriptionRu: emptyToNull(dto.descriptionRu),
        photos: [],
      },
    });
  }

  async update(ownerId: string, id: string, dto: UpdateBusinessDto) {
    const existing = await this.assertOwner(ownerId, id);
    const descriptionTk =
      dto.descriptionTk === undefined
        ? existing.descriptionTk
        : emptyToNull(dto.descriptionTk);
    const descriptionEn =
      dto.descriptionEn === undefined
        ? existing.descriptionEn
        : emptyToNull(dto.descriptionEn);
    const descriptionRu =
      dto.descriptionRu === undefined
        ? existing.descriptionRu
        : emptyToNull(dto.descriptionRu);
    return this.prisma.business.update({
      where: { id },
      data: {
        name: dto.name,
        categoryId: dto.categoryId,
        description:
          firstText(
            descriptionTk ?? undefined,
            descriptionEn ?? undefined,
            descriptionRu ?? undefined,
          ) ??
          dto.description ??
          existing.description,
        descriptionTk,
        descriptionEn,
        descriptionRu,
      },
    });
  }

  async remove(ownerId: string, id: string) {
    await this.assertOwner(ownerId, id);
    // Bookings reference offerings without cascade — block instead of a 500.
    const bookings = await this.prisma.booking.count({
      where: { offering: { businessId: id } },
    });
    if (bookings > 0) {
      throw new ConflictException('Business has bookings and cannot be deleted');
    }
    await this.prisma.business.delete({ where: { id } });
    return { success: true };
  }

  async addPhoto(ownerId: string, id: string, url: string) {
    const business = await this.assertOwner(ownerId, id);
    return this.prisma.business.update({
      where: { id },
      data: { photos: [...business.photos, url] },
    });
  }

  /** Throws unless the business exists and belongs to ownerId. */
  async assertOwner(ownerId: string, id: string) {
    const business = await this.prisma.business.findUnique({ where: { id } });
    if (!business) throw new NotFoundException('Business not found');
    if (business.ownerId !== ownerId) {
      throw new ForbiddenException('Not your business');
    }
    return business;
  }
}
