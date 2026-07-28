import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GatewayService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /**
   * A gateway with no heartbeat for this long is considered offline — the
   * app has no reliable way to signal "going offline" itself, so staleness
   * is the only signal. Default comfortably survives one missed periodic
   * heartbeat (WorkManager's minimum periodic interval is 15 minutes).
   */
  private get ttlMs(): number {
    const seconds = parseInt(
      this.config.get<string>('GATEWAY_ONLINE_TTL_SEC') ?? '1200',
      10,
    );
    return seconds * 1000;
  }

  /** Upserts the heartbeat's timestamp for this phone number. */
  async heartbeat(phoneNumber: string) {
    await this.prisma.smsGateway.upsert({
      where: { phoneNumber },
      update: { lastSeenAt: new Date() },
      create: { phoneNumber },
    });
  }

  /** The most recently seen phone number that is still within the TTL, if any. */
  async getActiveNumber(): Promise<string | null> {
    const latest = await this.prisma.smsGateway.findFirst({
      where: { lastSeenAt: { gte: new Date(Date.now() - this.ttlMs) } },
      orderBy: { lastSeenAt: 'desc' },
    });
    return latest?.phoneNumber ?? null;
  }

  /** All known gateways with a derived online flag, most recent first. */
  async adminList() {
    const gateways = await this.prisma.smsGateway.findMany({
      orderBy: { lastSeenAt: 'desc' },
    });
    const threshold = Date.now() - this.ttlMs;
    return gateways.map((g) => ({
      ...g,
      online: g.lastSeenAt.getTime() >= threshold,
    }));
  }
}
