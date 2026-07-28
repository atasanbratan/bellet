import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminUsersController } from './admin-users.controller';

@Module({
  controllers: [AdminUsersController],
  providers: [UsersService],
})
export class UsersModule {}
