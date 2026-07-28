import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateBookingDto) {
    return this.bookings.create(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  mine(@CurrentUser('userId') userId: string) {
    return this.bookings.findMine(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Get('business/:businessId')
  forBusiness(
    @CurrentUser('userId') userId: string,
    @Param('businessId') businessId: string,
  ) {
    return this.bookings.findForBusiness(userId, businessId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancel(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.bookings.cancel(userId, id);
  }
}
