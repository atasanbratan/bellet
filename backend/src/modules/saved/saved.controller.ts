import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SavedService } from './saved.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/** Bookmarking is per-signed-in-user; any role may save a centre. */
@UseGuards(JwtAuthGuard)
@Controller()
export class SavedController {
  constructor(private readonly saved: SavedService) {}

  @Post('businesses/:id/save')
  save(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.saved.save(userId, id);
  }

  @Delete('businesses/:id/save')
  remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.saved.remove(userId, id);
  }

  @Get('me/saved')
  list(@CurrentUser('userId') userId: string) {
    return this.saved.list(userId);
  }

  @Get('me/saved/ids')
  listIds(@CurrentUser('userId') userId: string) {
    return this.saved.listIds(userId);
  }
}
