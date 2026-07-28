import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsDevController } from './payments.controller';
import { AdminPaymentsController } from './admin-payments.controller';
import { OwnerPaymentsController } from './owner-payments.controller';
import { MockPaymentProvider } from './mock-payment.provider';
import { PAYMENT_PROVIDER } from './payment-provider.interface';

@Module({
  controllers: [
    PaymentsDevController,
    AdminPaymentsController,
    OwnerPaymentsController,
  ],
  providers: [
    PaymentsService,
    MockPaymentProvider,
    // Swap this provider for the real bank-card one later — nothing else changes.
    { provide: PAYMENT_PROVIDER, useExisting: MockPaymentProvider },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
