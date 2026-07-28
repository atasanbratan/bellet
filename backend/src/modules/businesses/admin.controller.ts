import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BusinessStatus, Role } from '@prisma/client';
import { BusinessesService } from './businesses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

const STATUSES = new Set(Object.values(BusinessStatus));

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly businesses: BusinessesService) {}

  @Get('businesses')
  list(@Query('status') status?: string) {
    const valid =
      status && STATUSES.has(status as BusinessStatus)
        ? (status as BusinessStatus)
        : undefined;
    return this.businesses.adminList(valid);
  }

  @Patch('businesses/:id/approve')
  approve(@Param('id') id: string) {
    return this.businesses.setStatus(id, BusinessStatus.APPROVED);
  }

  @Patch('businesses/:id/reject')
  reject(@Param('id') id: string) {
    return this.businesses.setStatus(id, BusinessStatus.REJECTED);
  }
}
