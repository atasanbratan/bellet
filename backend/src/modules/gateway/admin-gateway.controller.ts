import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { GatewayService } from './gateway.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

/** Admin view of every gateway phone number that has ever reported in. */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/gateways')
export class AdminGatewayController {
  constructor(private readonly gateway: GatewayService) {}

  @Get()
  list() {
    return this.gateway.adminList();
  }
}
