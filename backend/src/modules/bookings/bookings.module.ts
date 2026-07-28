import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { OwnerBookingsController } from './owner-bookings.controller';
import { PaymentsModule } from '../payments/payments.module';
import { BusinessesModule } from '../businesses/businesses.module';

@Module({
  imports: [PaymentsModule, BusinessesModule],
  controllers: [BookingsController, OwnerBookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
