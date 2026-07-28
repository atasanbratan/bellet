import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BusinessesService } from '../businesses/businesses.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businesses: BusinessesService,
  ) {}

  async create(ownerId: string, dto: CreateTeacherDto) {
    await this.businesses.assertOwner(ownerId, dto.businessId);
    return this.prisma.teacher.create({
      data: { businessId: dto.businessId, name: dto.name, bio: dto.bio },
    });
  }

  async update(ownerId: string, id: string, dto: UpdateTeacherDto) {
    await this.assertOwner(ownerId, id);
    return this.prisma.teacher.update({ where: { id }, data: dto });
  }

  async remove(ownerId: string, id: string) {
    await this.assertOwner(ownerId, id);
    await this.prisma.teacher.delete({ where: { id } });
    return { success: true };
  }

  async setPhoto(ownerId: string, id: string, url: string) {
    await this.assertOwner(ownerId, id);
    return this.prisma.teacher.update({ where: { id }, data: { photo: url } });
  }

  private async assertOwner(ownerId: string, id: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { id } });
    if (!teacher) throw new NotFoundException('Teacher not found');
    await this.businesses.assertOwner(ownerId, teacher.businessId);
    return teacher;
  }
}
