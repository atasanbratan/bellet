import { IsIn, IsString } from 'class-validator';

export class SimulatePaymentDto {
  @IsString()
  paymentId!: string;

  @IsIn(['PAID', 'FAILED'])
  outcome!: 'PAID' | 'FAILED';
}
