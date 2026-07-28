import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/** Guard clauses that reject bad references with a 400 (not a Prisma 500). */

export async function assertTeacherInBusiness(
  prisma: PrismaService,
  teacherId: string | null | undefined,
  businessId: string,
) {
  if (!teacherId) return;
  const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
  if (!teacher || teacher.businessId !== businessId) {
    throw new BadRequestException('Teacher does not belong to this business');
  }
}

export async function assertAddressInBusiness(
  prisma: PrismaService,
  addressId: string | null | undefined,
  businessId: string,
) {
  if (!addressId) return;
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.businessId !== businessId) {
    throw new BadRequestException('Address does not belong to this business');
  }
}

/** Reject unknown subject ids with a 400 rather than a Prisma connect error. */
export async function assertSubjectsExist(
  prisma: PrismaService,
  subjectIds: string[] | undefined,
) {
  if (!subjectIds?.length) return;
  const found = await prisma.subject.count({
    where: { id: { in: subjectIds } },
  });
  if (found !== new Set(subjectIds).size) {
    throw new BadRequestException('Unknown subject');
  }
}
