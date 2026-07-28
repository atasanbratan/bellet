import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

/** Apply one set of dates to several groups of a course at once. */
export class BulkGroupDatesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  groupIds!: string[];

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
