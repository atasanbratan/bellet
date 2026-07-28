import { Injectable, Logger } from '@nestjs/common';
import { VerificationPurpose, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { normalizePhone } from '../../common/utils/phone.util';

/**
 * Core of reverse-SMS auth. Both the real Android gateway (via
 * POST /auth/sms/incoming) and the dev mock (POST /auth/dev/simulate-sms)
 * call report() when an empty SMS is received from a user's phone.
 */
@Injectable()
export class IncomingSmsService {
  private readonly logger = new Logger(IncomingSmsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async report(
    fromPhone: string,
  ): Promise<{ matched: boolean; purpose?: VerificationPurpose }> {
    const phone = normalizePhone(fromPhone);

    const verification = await this.prisma.phoneVerification.findFirst({
      where: {
        phone,
        status: VerificationStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!verification) {
      this.logger.warn(
        `Incoming SMS from ${phone} matched no pending verification`,
      );
      return { matched: false };
    }

    await this.prisma.phoneVerification.update({
      where: { id: verification.id },
      data: { status: VerificationStatus.VERIFIED, verifiedAt: new Date() },
    });

    if (verification.purpose === VerificationPurpose.ACCOUNT_VERIFICATION) {
      await this.prisma.user.updateMany({
        where: { phone },
        data: { phoneVerified: true },
      });
    }

    this.logger.log(`Verified ${phone} (${verification.purpose})`);
    return { matched: true, purpose: verification.purpose };
  }
}
