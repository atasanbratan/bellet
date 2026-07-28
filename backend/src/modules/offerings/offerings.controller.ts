import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { OfferingsService } from './offerings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateOfferingDto } from './dto/create-offering.dto';
import { UpdateOfferingDto } from './dto/update-offering.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { BulkGroupDatesDto } from './dto/bulk-group-dates.dto';

@Controller('offerings')
export class OfferingsController {
  constructor(private readonly offerings: OfferingsService) {}

  // --- Public ---------------------------------------------------------------

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offerings.findOnePublic(id);
  }

  // --- Owner: offerings -----------------------------------------------------

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateOfferingDto) {
    return this.offerings.create(userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Patch(':id')
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateOfferingDto,
  ) {
    return this.offerings.update(userId, id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Delete(':id')
  remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.offerings.remove(userId, id);
  }

  // --- Owner: groups (toparlar) ---------------------------------------------

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Post(':id/groups')
  addGroup(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: CreateGroupDto,
  ) {
    return this.offerings.addGroup(userId, id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Patch(':id/groups/dates')
  bulkSetGroupDates(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: BulkGroupDatesDto,
  ) {
    return this.offerings.bulkSetGroupDates(userId, id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Patch('groups/:groupId')
  updateGroup(
    @CurrentUser('userId') userId: string,
    @Param('groupId') groupId: string,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.offerings.updateGroup(userId, groupId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Delete('groups/:groupId')
  removeGroup(
    @CurrentUser('userId') userId: string,
    @Param('groupId') groupId: string,
  ) {
    return this.offerings.removeGroup(userId, groupId);
  }
}
