import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './modules/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { ProvincesModule } from './modules/provinces/provinces.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { OwnerModule } from './modules/owner/owner.module';
import { SavedModule } from './modules/saved/saved.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { OfferingsModule } from './modules/offerings/offerings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { SearchModule } from './modules/search/search.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }]),
    PrismaModule,
    StorageModule,
    AuthModule,
    AdminModule,
    UsersModule,
    CategoriesModule,
    BusinessesModule,
    AddressesModule,
    ProvincesModule,
    SubjectsModule,
    OwnerModule,
    SavedModule,
    TeachersModule,
    OfferingsModule,
    PaymentsModule,
    BookingsModule,
    SearchModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
