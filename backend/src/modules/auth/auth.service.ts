import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, VerificationPurpose, VerificationStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { normalizePhone } from '../../common/utils/phone.util';
import { parseDurationMs } from '../../common/utils/duration.util';
import { GatewayService } from '../gateway/gateway.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly gateway: GatewayService,
  ) {}

  private get verificationTtlMs(): number {
    const minutes = parseInt(
      this.config.get<string>('PHONE_VERIFICATION_TTL_MIN') ?? '10',
      10,
    );
    return minutes * 60_000;
  }

  /** The number to send the empty SMS to: the active gateway, or the env fallback. */
  private async sendSmsTo(): Promise<string> {
    const active = await this.gateway.getActiveNumber();
    return active ?? this.config.get<string>('OUR_SMS_NUMBER') ?? '';
  }

  // --- Registration + verification ------------------------------------------

  async register(dto: RegisterDto) {
    const phone = normalizePhone(dto.phone);
    const existing = await this.prisma.user.findUnique({ where: { phone } });
    if (existing?.phoneVerified) {
      throw new ConflictException('Phone already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const role = dto.role === 'OWNER' ? Role.OWNER : Role.CLIENT;
    if (existing) {
      // Unverified account re-registering — refresh credentials, resend SMS.
      await this.prisma.user.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          name: dto.name ?? existing.name,
          email: dto.email ?? existing.email,
          role,
        },
      });
    } else {
      await this.prisma.user.create({
        data: {
          phone,
          passwordHash,
          name: dto.name,
          email: dto.email,
          role,
        },
      });
    }

    const verification = await this.createVerification(
      phone,
      VerificationPurpose.ACCOUNT_VERIFICATION,
    );
    return {
      verificationId: verification.id,
      sendSmsTo: await this.sendSmsTo(),
      phone,
    };
  }

  async login(dto: LoginDto) {
    const phone = normalizePhone(dto.phone);
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.phoneVerified) {
      throw new ForbiddenException('Account not verified');
    }
    return this.issueTokens(user.id, user.role, user.phone, user.name);
  }

  /** Polled by the frontend. Returns tokens (verification) or a resetToken (reset). */
  async status(verificationId: string) {
    const v = await this.prisma.phoneVerification.findUnique({
      where: { id: verificationId },
    });
    if (!v) throw new NotFoundException('Verification not found');

    if (v.status === VerificationStatus.PENDING && v.expiresAt < new Date()) {
      await this.prisma.phoneVerification.update({
        where: { id: v.id },
        data: { status: VerificationStatus.EXPIRED },
      });
      return { status: VerificationStatus.EXPIRED };
    }

    if (v.status !== VerificationStatus.VERIFIED) {
      return { status: v.status };
    }

    if (v.purpose === VerificationPurpose.ACCOUNT_VERIFICATION) {
      const user = await this.prisma.user.findUnique({ where: { phone: v.phone } });
      if (!user) throw new NotFoundException('User not found');
      const tokens = await this.issueTokens(user.id, user.role, user.phone, user.name);
      return { status: VerificationStatus.VERIFIED, purpose: v.purpose, ...tokens };
    }

    // PASSWORD_RESET → short-lived reset token
    const resetToken = await this.jwt.signAsync(
      { sub: v.phone, typ: 'reset', vid: v.id },
      { secret: this.config.get<string>('JWT_ACCESS_SECRET'), expiresIn: '10m' },
    );
    return { status: VerificationStatus.VERIFIED, purpose: v.purpose, resetToken };
  }

  // --- Forgot / reset password ----------------------------------------------

  async forgotPassword(phoneRaw: string) {
    const phone = normalizePhone(phoneRaw);
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) throw new NotFoundException('No account for this phone');

    const verification = await this.createVerification(
      phone,
      VerificationPurpose.PASSWORD_RESET,
    );
    return {
      verificationId: verification.id,
      sendSmsTo: await this.sendSmsTo(),
      phone,
    };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    let payload: { sub: string; typ?: string };
    try {
      payload = await this.jwt.verifyAsync(resetToken, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      });
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }
    if (payload.typ !== 'reset') {
      throw new BadRequestException('Invalid reset token');
    }

    const user = await this.prisma.user.findUnique({ where: { phone: payload.sub } });
    if (!user) throw new NotFoundException('User not found');

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });
    // Invalidate all sessions after a password reset.
    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { success: true };
  }

  // --- Token lifecycle ------------------------------------------------------

  async refresh(refreshToken: string) {
    let payload: { sub: string; jti: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const row = await this.prisma.refreshToken.findUnique({
      where: { id: payload.jti },
    });
    if (!row || row.revokedAt || row.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token revoked or expired');
    }
    if (!(await bcrypt.compare(refreshToken, row.tokenHash))) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Rotate: revoke the used token, issue a fresh pair.
    await this.prisma.refreshToken.update({
      where: { id: row.id },
      data: { revokedAt: new Date() },
    });
    const user = await this.prisma.user.findUnique({ where: { id: row.userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return this.issueTokens(user.id, user.role, user.phone, user.name);
  }

  async logout(refreshToken: string) {
    try {
      const payload: { jti: string } = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
      await this.prisma.refreshToken.updateMany({
        where: { id: payload.jti, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } catch {
      // A bad/expired token is already effectively logged out.
    }
    return { success: true };
  }

  // --- Helpers --------------------------------------------------------------

  private async createVerification(phone: string, purpose: VerificationPurpose) {
    // Supersede any earlier pending verification of the same purpose.
    await this.prisma.phoneVerification.updateMany({
      where: { phone, purpose, status: VerificationStatus.PENDING },
      data: { status: VerificationStatus.EXPIRED },
    });
    return this.prisma.phoneVerification.create({
      data: {
        phone,
        purpose,
        expiresAt: new Date(Date.now() + this.verificationTtlMs),
      },
    });
  }

  /**
   * `name` rides along in the access token so the UI can greet the user
   * without an extra round-trip. It's short-lived (15m) and re-minted on
   * refresh, so it can't drift far from the row.
   */
  private async issueTokens(
    userId: string,
    role: Role,
    phone: string,
    name: string | null,
  ) {
    const accessToken = await this.jwt.signAsync(
      { sub: userId, role, phone, name },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: (this.config.get<string>('JWT_ACCESS_TTL') ?? '15m') as any,
      },
    );

    const refreshTtl = this.config.get<string>('JWT_REFRESH_TTL') ?? '7d';
    const expiresAt = new Date(Date.now() + parseDurationMs(refreshTtl));
    // Create the row first so its id can be embedded as the token's jti.
    const row = await this.prisma.refreshToken.create({
      data: { userId, tokenHash: 'pending', expiresAt },
    });
    const refreshToken = await this.jwt.signAsync(
      { sub: userId, jti: row.id },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshTtl as any,
      },
    );
    await this.prisma.refreshToken.update({
      where: { id: row.id },
      data: { tokenHash: await bcrypt.hash(refreshToken, 10) },
    });

    return { accessToken, refreshToken };
  }
}
