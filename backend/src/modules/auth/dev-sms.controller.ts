import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncomingSmsService } from './incoming-sms.service';
import { SimulateSmsDto } from './dto/simulate-sms.dto';

/**
 * DEV-ONLY mock of the Android SMS gateway. Lets you complete the verification
 * flow without a real SIM. Disabled when NODE_ENV=production.
 */
@Controller('auth/dev')
export class DevSmsController {
  constructor(
    private readonly incomingSms: IncomingSmsService,
    private readonly config: ConfigService,
  ) {}

  @Post('simulate-sms')
  simulate(@Body() dto: SimulateSmsDto) {
    if (this.config.get<string>('NODE_ENV') === 'production') {
      throw new ForbiddenException('Disabled in production');
    }
    return this.incomingSms.report(dto.phone);
  }
}
