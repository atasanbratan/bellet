import { Matches } from 'class-validator';

export class HeartbeatDto {
  /** Same phone number format as IncomingSmsDto — the SIM's own number. */
  @Matches(/^\+?[0-9]{8,15}$/, { message: 'phoneNumber must be a valid number' })
  phoneNumber!: string;
}
