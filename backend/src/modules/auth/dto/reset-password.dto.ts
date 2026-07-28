import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  resetToken!: string;

  @IsString()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  newPassword!: string;
}
