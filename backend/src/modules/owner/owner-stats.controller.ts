import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { OwnerStatsService } from './owner-stats.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER)
@Controller('owner/stats')
export class OwnerStatsController {
  constructor(private readonly stats: OwnerStatsService) {}

  @Get()
  overview(@CurrentUser('userId') userId: string) {
    return this.stats.overview(userId);
  }
}
