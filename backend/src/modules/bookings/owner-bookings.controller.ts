import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { QueryBookingsDto } from './dto/query-bookings.dto';

/** Bookings received by the owner's (single) business, as a data table. */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER)
@Controller('owner/bookings')
export class OwnerBookingsController {
  constructor(
    private readonly bookings: BookingsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async list(
    @CurrentUser('userId') userId: string,
    @Query() query: QueryBookingsDto,
  ) {
    const business = await this.prisma.business.findUnique({
      where: { ownerId: userId },
      select: { id: true },
    });
    if (!business) {
      return {
        items: [],
        total: 0,
        page: query.page,
        pageSize: query.pageSize,
        totalPages: 0,
        stats: { count: 0, confirmed: 0, pending: 0, cancelled: 0 },
      };
    }
    return this.bookings.findPaginated(query, business.id);
  }
}
