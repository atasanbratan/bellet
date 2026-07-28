import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpsertAddressDto {
  @IsString()
  provinceId!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  line!: string;
}
