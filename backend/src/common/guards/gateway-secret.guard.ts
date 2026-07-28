import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Protects /auth/sms/incoming. Only the (future) Android SMS-gateway app knows
 * GATEWAY_SECRET. This guard is the whole security model of reverse-SMS auth:
 * without it, anyone could claim an SMS arrived from any phone and log in as them.
 */
@Injectable()
export class GatewaySecretGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const provided = request.headers['x-gateway-secret'];
    const expected = this.config.get<string>('GATEWAY_SECRET');
    if (!expected || provided !== expected) {
      throw new UnauthorizedException('Invalid gateway secret');
    }
    return true;
  }
}
