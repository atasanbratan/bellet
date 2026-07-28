import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { AdminGatewayController } from './admin-gateway.controller';
import { GatewaySecretGuard } from '../../common/guards/gateway-secret.guard';

@Module({
  controllers: [GatewayController, AdminGatewayController],
  providers: [GatewayService, GatewaySecretGuard],
  exports: [GatewayService],
})
export class GatewayModule {}
