import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateOfferingDto } from './create-offering.dto';

export class UpdateOfferingDto extends PartialType(
  OmitType(CreateOfferingDto, ['businessId'] as const),
) {}
