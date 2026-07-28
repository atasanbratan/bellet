import { Matches } from 'class-validator';

export class IncomingSmsDto {
  @Matches(/^\+?[0-9]{8,15}$/, { message: 'fromPhone must be a valid number' })
  fromPhone!: string;
}
