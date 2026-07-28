import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DevSmsController } from './dev-sms.controller';
import { IncomingSmsService } from './incoming-sms.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GatewaySecretGuard } from '../../common/guards/gateway-secret.guard';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [PassportModule, JwtModule.register({}), GatewayModule],
  controllers: [AuthController, DevSmsController],
  providers: [AuthService, IncomingSmsService, JwtStrategy, GatewaySecretGuard],
  exports: [AuthService],
})
export class AuthModule {}
