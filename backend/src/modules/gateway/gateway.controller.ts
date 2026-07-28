import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewaySecretGuard } from '../../common/guards/gateway-secret.guard';
import { HeartbeatDto } from './dto/heartbeat.dto';

/** Called by the Android SMS-gateway app on start, on enable, and periodically. */
@UseGuards(GatewaySecretGuard)
@Controller('gateway')
export class GatewayController {
  constructor(private readonly gateway: GatewayService) {}

  @Post('heartbeat')
  async heartbeat(@Body() dto: HeartbeatDto) {
    await this.gateway.heartbeat(dto.phoneNumber);
    return { success: true };
  }
}
