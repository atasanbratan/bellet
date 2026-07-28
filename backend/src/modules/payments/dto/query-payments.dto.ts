import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '@prisma/client';
import { PaginationDto } from '../../users/dto/pagination.dto';

/** Filterable payments listing shared by admin and owner tables. */
export class QueryPaymentsDto extends PaginationDto {
  /** Matches client name or phone. */
  @IsOptional()
  @IsString()
  client?: string;

  /** Matches the course title in any language. */
  @IsOptional()
  @IsString()
  course?: string;

  /** Matches the center name (admin table only). */
  @IsOptional()
  @IsString()
  business?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsISO8601()
  dateFrom?: string;

  @IsOptional()
  @IsISO8601()
  dateTo?: string;
}
