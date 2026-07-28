import { Controller, Get } from '@nestjs/common';
import { ProvincesService } from './provinces.service';

@Controller('provinces')
export class ProvincesController {
  constructor(private readonly provinces: ProvincesService) {}

  @Get()
  findAll() {
    return this.provinces.findAll();
  }
}
