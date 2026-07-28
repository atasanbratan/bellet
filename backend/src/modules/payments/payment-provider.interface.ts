export type PaymentProviderStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface CreatePaymentInput {
  bookingId: string;
  amount: number;
}

export interface CreatePaymentResult {
  externalRef: string;
  status: PaymentProviderStatus;
  redirectUrl?: string;
}

/**
 * The seam that keeps payments swappable. MockPaymentProvider implements this
 * today; a real BankCardProvider will implement the same interface later with
 * zero changes to bookings/payments logic.
 */
export interface PaymentProvider {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(externalRef: string): Promise<PaymentProviderStatus>;
}

export const PAYMENT_PROVIDER = 'PAYMENT_PROVIDER';
