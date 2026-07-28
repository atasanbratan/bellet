import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { QueryPaymentsDto } from './dto/query-payments.dto';

/** Payments received by the owner's (single) business. */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER)
@Controller('owner/payments')
export class OwnerPaymentsController {
  constructor(
    private readonly payments: PaymentsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async list(
    @CurrentUser('userId') userId: string,
    @Query() query: QueryPaymentsDto,
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
        stats: { count: 0, totalAmount: 0, paidCount: 0, paidAmount: 0 },
      };
    }
    // The center-name filter is admin-only; owners are always self-scoped.
    return this.payments.findPaginated(
      { ...query, business: undefined },
      business.id,
    );
  }
}
