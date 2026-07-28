import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpsertAddressDto } from './dto/upsert-address.dto';

@Controller('businesses/:businessId/addresses')
export class AddressesController {
  constructor(private readonly addresses: AddressesService) {}

  @Get()
  list(@Param('businessId') businessId: string) {
    return this.addresses.list(businessId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Post()
  create(
    @CurrentUser('userId') userId: string,
    @Param('businessId') businessId: string,
    @Body() dto: UpsertAddressDto,
  ) {
    return this.addresses.create(userId, businessId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Patch(':addressId')
  update(
    @CurrentUser('userId') userId: string,
    @Param('businessId') businessId: string,
    @Param('addressId') addressId: string,
    @Body() dto: UpsertAddressDto,
  ) {
    return this.addresses.update(userId, businessId, addressId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Delete(':addressId')
  remove(
    @CurrentUser('userId') userId: string,
    @Param('businessId') businessId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.addresses.remove(userId, businessId, addressId);
  }
}
