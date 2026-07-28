import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BusinessesService } from '../businesses/businesses.service';
import { UpsertAddressDto } from './dto/upsert-address.dto';

/** Owner-managed physical locations (buildings) of a business. */
@Injectable()
export class AddressesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businesses: BusinessesService,
  ) {}

  async list(businessId: string) {
    return this.prisma.address.findMany({
      where: { businessId },
      include: { province: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(ownerId: string, businessId: string, dto: UpsertAddressDto) {
    await this.businesses.assertOwner(ownerId, businessId);
    await this.assertProvinceExists(dto.provinceId);
    return this.prisma.address.create({
      data: { businessId, provinceId: dto.provinceId, line: dto.line },
      include: { province: true },
    });
  }

  async update(
    ownerId: string,
    businessId: string,
    addressId: string,
    dto: UpsertAddressDto,
  ) {
    await this.businesses.assertOwner(ownerId, businessId);
    await this.assertBelongsToBusiness(addressId, businessId);
    await this.assertProvinceExists(dto.provinceId);
    return this.prisma.address.update({
      where: { id: addressId },
      data: { provinceId: dto.provinceId, line: dto.line },
      include: { province: true },
    });
  }

  async remove(ownerId: string, businessId: string, addressId: string) {
    await this.businesses.assertOwner(ownerId, businessId);
    await this.assertBelongsToBusiness(addressId, businessId);
    const groups = await this.prisma.group.count({ where: { addressId } });
    if (groups > 0) {
      throw new ConflictException(
        'Address is used by a group and cannot be deleted',
      );
    }
    await this.prisma.address.delete({ where: { id: addressId } });
    return { success: true };
  }

  private async assertBelongsToBusiness(addressId: string, businessId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });
    if (!address || address.businessId !== businessId) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  private async assertProvinceExists(provinceId: string) {
    const province = await this.prisma.province.findUnique({
      where: { id: provinceId },
    });
    if (!province) throw new BadRequestException('Unknown province');
  }
}
