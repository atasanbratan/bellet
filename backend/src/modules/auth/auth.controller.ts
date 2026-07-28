import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { IncomingSmsService } from './incoming-sms.service';
import { GatewaySecretGuard } from '../../common/guards/gateway-secret.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshDto } from './dto/refresh.dto';
import { IncomingSmsDto } from './dto/incoming-sms.dto';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly incomingSms: IncomingSmsService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('status/:verificationId')
  status(@Param('verificationId') id: string) {
    return this.auth.status(id);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto.phone);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.resetToken, dto.newPassword);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @Post('logout')
  logout(@Body() dto: RefreshDto) {
    return this.auth.logout(dto.refreshToken);
  }

  /**
   * Called by the Android SMS-gateway app when an empty SMS arrives on our SIM.
   * Protected by GATEWAY_SECRET — see GatewaySecretGuard.
   */
  @UseGuards(GatewaySecretGuard)
  @Post('sms/incoming')
  incoming(@Body() dto: IncomingSmsDto) {
    return this.incomingSms.report(dto.fromPhone);
  }
}
