import { Module } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { AdminController } from './admin.controller';

@Module({
  controllers: [BusinessesController, AdminController],
  providers: [BusinessesService],
  exports: [BusinessesService],
})
export class BusinessesModule {}
