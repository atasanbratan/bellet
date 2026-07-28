import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '@prisma/client';
import { PaginationDto } from '../../users/dto/pagination.dto';

/** Filterable bookings listing for the owner data table. */
export class QueryBookingsDto extends PaginationDto {
  /** Matches client name or phone. */
  @IsOptional()
  @IsString()
  client?: string;

  /** Matches the course title in any language. */
  @IsOptional()
  @IsString()
  course?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsISO8601()
  dateFrom?: string;

  @IsOptional()
  @IsISO8601()
  dateTo?: string;
}
