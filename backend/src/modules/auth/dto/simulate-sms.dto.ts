import { Matches } from 'class-validator';

export class SimulateSmsDto {
  @Matches(/^\+?[0-9]{8,15}$/, { message: 'phone must be a valid number' })
  phone!: string;
}
