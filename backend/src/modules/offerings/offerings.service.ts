import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BusinessesService } from '../businesses/businesses.service';
import { CreateOfferingDto } from './dto/create-offering.dto';
import { UpdateOfferingDto } from './dto/update-offering.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { BulkGroupDatesDto } from './dto/bulk-group-dates.dto';
import { assertEnrollWindow, groupDatesData } from './group-dates';
import {
  assertAddressInBusiness,
  assertSubjectsExist,
  assertTeacherInBusiness,
} from './offering-asserts';

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

/** Update semantics: undefined keeps the current value, '' clears it. */
function pick(incoming: string | undefined, current: string | null) {
  if (incoming === undefined) return current;
  return emptyToNull(incoming);
}

@Injectable()
export class OfferingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businesses: BusinessesService,
  ) {}

  async findOnePublic(id: string) {
    const offering = await this.prisma.offering.findUnique({
      where: { id },
      include: {
        business: { include: { category: true } },
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
    });
    if (!offering) throw new NotFoundException('Offering not found');
    return offering;
  }

  async create(ownerId: string, dto: CreateOfferingDto) {
    await this.businesses.assertOwner(ownerId, dto.businessId);
    const title = firstText(dto.titleTk, dto.titleEn, dto.titleRu, dto.title);
    if (!title) {
      throw new BadRequestException('Title is required in at least one language');
    }
    await assertSubjectsExist(this.prisma, dto.subjectIds);
    return this.prisma.offering.create({
      data: {
        businessId: dto.businessId,
        title,
        titleTk: emptyToNull(dto.titleTk),
        titleEn: emptyToNull(dto.titleEn),
        titleRu: emptyToNull(dto.titleRu),
        description: firstText(
          dto.descriptionTk,
          dto.descriptionEn,
          dto.descriptionRu,
          dto.description,
        ),
        descriptionTk: emptyToNull(dto.descriptionTk),
        descriptionEn: emptyToNull(dto.descriptionEn),
        descriptionRu: emptyToNull(dto.descriptionRu),
        price: dto.price,
        prepaymentAmount: dto.prepaymentAmount,
        ...(dto.subjectIds
          ? { subjects: { connect: dto.subjectIds.map((id) => ({ id })) } }
          : {}),
      },
      include: { subjects: true, groups: { include: { teacher: true, address: true } } },
    });
  }

  async update(ownerId: string, id: string, dto: UpdateOfferingDto) {
    const existing = await this.assertOwnerByOffering(ownerId, id);
    await assertSubjectsExist(this.prisma, dto.subjectIds);
    const titleTk = pick(dto.titleTk, existing.titleTk);
    const titleEn = pick(dto.titleEn, existing.titleEn);
    const titleRu = pick(dto.titleRu, existing.titleRu);
    const title =
      firstText(titleTk ?? undefined, titleEn ?? undefined, titleRu ?? undefined) ??
      dto.title ??
      existing.title;
    if (!title) {
      throw new BadRequestException('Title is required in at least one language');
    }
    const descriptionTk = pick(dto.descriptionTk, existing.descriptionTk);
    const descriptionEn = pick(dto.descriptionEn, existing.descriptionEn);
    const descriptionRu = pick(dto.descriptionRu, existing.descriptionRu);
    return this.prisma.offering.update({
      where: { id },
      data: {
        title,
        titleTk,
        titleEn,
        titleRu,
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
        price: dto.price,
        prepaymentAmount: dto.prepaymentAmount,
        // `set` replaces the whole list, so an empty array clears subjects.
        ...(dto.subjectIds
          ? { subjects: { set: dto.subjectIds.map((id) => ({ id })) } }
          : {}),
      },
      include: { subjects: true, groups: { include: { teacher: true, address: true } } },
    });
  }

  async remove(ownerId: string, id: string) {
    await this.assertOwnerByOffering(ownerId, id);
    // Bookings reference offerings without cascade — block instead of a 500.
    const bookings = await this.prisma.booking.count({
      where: { offeringId: id },
    });
    if (bookings > 0) {
      throw new ConflictException('Offering has bookings and cannot be deleted');
    }
    await this.prisma.offering.delete({ where: { id } });
    return { success: true };
  }

  // --- Groups (toparlar) ----------------------------------------------------

  async addGroup(ownerId: string, offeringId: string, dto: CreateGroupDto) {
    const offering = await this.assertOwnerByOffering(ownerId, offeringId);
    await assertTeacherInBusiness(this.prisma, dto.teacherId, offering.businessId);
    await assertAddressInBusiness(this.prisma, dto.addressId, offering.businessId);
    assertEnrollWindow(dto.enrollFrom, dto.enrollUntil);
    return this.prisma.group.create({
      data: {
        offeringId,
        teacherId: dto.teacherId ?? null,
        addressId: dto.addressId ?? null,
        days: dto.days,
        timeOfDay: dto.timeOfDay,
        startTime: dto.startTime,
        endTime: dto.endTime,
        capacity: dto.capacity ?? 0,
        ...groupDatesData(dto),
      },
      include: { teacher: true, address: { include: { province: true } } },
    });
  }

  async updateGroup(ownerId: string, groupId: string, dto: UpdateGroupDto) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { offering: true },
    });
    if (!group) throw new NotFoundException('Group not found');
    await this.businesses.assertOwner(ownerId, group.offering.businessId);
    if (dto.teacherId) {
      await assertTeacherInBusiness(this.prisma, dto.teacherId, group.offering.businessId);
    }
    if (dto.addressId) {
      await assertAddressInBusiness(this.prisma, dto.addressId, group.offering.businessId);
    }
    assertEnrollWindow(dto.enrollFrom, dto.enrollUntil);
    return this.prisma.group.update({
      where: { id: groupId },
      data: {
        teacherId: dto.teacherId === undefined ? undefined : dto.teacherId,
        addressId: dto.addressId === undefined ? undefined : dto.addressId,
        days: dto.days,
        timeOfDay: dto.timeOfDay,
        startTime: dto.startTime,
        endTime: dto.endTime,
        capacity: dto.capacity,
        ...groupDatesData(dto),
      },
      include: { teacher: true, address: { include: { province: true } } },
    });
  }

  /** Apply one set of dates to several groups of a course at once (atomic). */
  async bulkSetGroupDates(
    ownerId: string,
    offeringId: string,
    dto: BulkGroupDatesDto,
  ) {
    await this.assertOwnerByOffering(ownerId, offeringId);
    assertEnrollWindow(dto.enrollFrom, dto.enrollUntil);
    const ids = [...new Set(dto.groupIds)];
    const found = await this.prisma.group.count({
      where: { id: { in: ids }, offeringId },
    });
    if (found !== ids.length) {
      throw new BadRequestException('Some groups do not belong to this course');
    }
    const result = await this.prisma.group.updateMany({
      where: { id: { in: ids }, offeringId },
      data: groupDatesData(dto),
    });
    return { updated: result.count };
  }

  async removeGroup(ownerId: string, groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { offering: true },
    });
    if (!group) throw new NotFoundException('Group not found');
    await this.businesses.assertOwner(ownerId, group.offering.businessId);
    const bookings = await this.prisma.booking.count({ where: { groupId } });
    if (bookings > 0) {
      throw new ConflictException('Group has bookings and cannot be deleted');
    }
    await this.prisma.group.delete({ where: { id: groupId } });
    return { success: true };
  }

  // --- Helpers --------------------------------------------------------------

  /** Throws unless the offering exists and its business belongs to ownerId. */
  async assertOwnerByOffering(ownerId: string, offeringId: string) {
    const offering = await this.prisma.offering.findUnique({
      where: { id: offeringId },
    });
    if (!offering) throw new NotFoundException('Offering not found');
    await this.businesses.assertOwner(ownerId, offering.businessId);
    return offering;
  }
}
