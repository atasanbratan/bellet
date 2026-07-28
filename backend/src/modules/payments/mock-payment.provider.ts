import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
  PaymentProviderStatus,
} from './payment-provider.interface';

/**
 * Development stand-in for the future bank-card provider. Payments start PENDING
 * and are settled via the dev simulate endpoint (mimicking the bank callback).
 */
@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  readonly name = 'mock';
  private readonly statuses = new Map<string, PaymentProviderStatus>();

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const externalRef = `mock_${randomUUID()}`;
    this.statuses.set(externalRef, 'PENDING');
    return {
      externalRef,
      status: 'PENDING',
      redirectUrl: `/mock-pay/${externalRef}?amount=${input.amount}`,
    };
  }

  async verifyPayment(externalRef: string): Promise<PaymentProviderStatus> {
    return this.statuses.get(externalRef) ?? 'PENDING';
  }

  /** Dev-only: simulate the bank settling the payment. */
  settle(externalRef: string, status: PaymentProviderStatus): void {
    this.statuses.set(externalRef, status);
  }
}
