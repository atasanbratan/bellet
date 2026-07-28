import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @Matches(/^\+?[0-9]{8,15}$/, { message: 'phone must be a valid number' })
  phone!: string;

  @IsString()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  password!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  // Self-service signup may only choose CLIENT or OWNER (never ADMIN).
  @IsOptional()
  @IsIn(['CLIENT', 'OWNER'])
  role?: 'CLIENT' | 'OWNER';
}
