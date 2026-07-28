import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateOfferingDto {
  @IsString()
  businessId!: string;

  // Content i18n: at least one title variant is required (checked in service).
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  titleTk?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  titleEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  titleRu?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  descriptionTk?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  descriptionRu?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(0)
  prepaymentAmount!: number;

  /** Subjects this course covers; a course can span several. */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjectIds?: string[];
}
