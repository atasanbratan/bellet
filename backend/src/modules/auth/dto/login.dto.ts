import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @Matches(/^\+?[0-9]{8,15}$/, { message: 'phone must be a valid number' })
  phone!: string;

  @IsString()
  password!: string;
}
