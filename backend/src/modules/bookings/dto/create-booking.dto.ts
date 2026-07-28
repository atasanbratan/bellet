import { IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  offeringId!: string;

  @IsOptional()
  @IsString()
  groupId?: string;
}
