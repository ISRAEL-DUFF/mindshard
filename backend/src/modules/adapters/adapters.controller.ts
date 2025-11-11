import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AdaptersService } from './adapters.service';
import { CreateAdapterDto } from './dto/create-adapter.dto';

@Controller('adapters')
export class AdaptersController {
  constructor(private readonly service: AdaptersService) {}

  @Post()
  async create(@Body() dto: CreateAdapterDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
