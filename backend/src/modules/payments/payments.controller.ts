import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { SimulatePaymentDto } from './dto/simulate-payment.dto';

/**
 * DEV-ONLY payment simulation (stands in for the bank callback).
 * Disabled when NODE_ENV=production.
 */
@Controller('payments/dev')
export class PaymentsDevController {
  constructor(
    private readonly payments: PaymentsService,
    private readonly config: ConfigService,
  ) {}

  @Post('simulate')
  simulate(@Body() dto: SimulatePaymentDto) {
    if (this.config.get<string>('NODE_ENV') === 'production') {
      throw new ForbiddenException('Disabled in production');
    }
    return this.payments.simulate(dto.paymentId, dto.outcome);
  }
}
