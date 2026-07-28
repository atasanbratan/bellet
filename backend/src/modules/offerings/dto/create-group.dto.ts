import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateGroupDto {
  @IsOptional()
  @IsString()
  teacherId?: string;

  @IsOptional()
  @IsString()
  addressId?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  days!: number[]; // e.g. [1, 3, 5]

  @IsIn(['MORNING', 'AFTERNOON', 'EVENING'])
  timeOfDay!: 'MORNING' | 'AFTERNOON' | 'EVENING';

  @Matches(TIME, { message: 'startTime must be HH:mm' })
  startTime!: string;

  @Matches(TIME, { message: 'endTime must be HH:mm' })
  endTime!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  capacity?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(520)
  durationWeeks?: number;

  @IsOptional()
  @IsDateString()
  enrollFrom?: string;

  @IsOptional()
  @IsDateString()
  enrollUntil?: string;
}
