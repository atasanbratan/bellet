import { Module } from '@nestjs/common';
import { OwnerStatsService } from './owner-stats.service';
import { OwnerStatsController } from './owner-stats.controller';

@Module({
  controllers: [OwnerStatsController],
  providers: [OwnerStatsService],
})
export class OwnerModule {}
