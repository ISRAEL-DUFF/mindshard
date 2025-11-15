import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { AdaptersService } from './adapters.service';
import { CreateAdapterDto } from './dto/create-adapter.dto';

@Controller('adapters')
export class AdaptersController {
  constructor(private readonly service: AdaptersService) {}

  @Post()
  async create(@Body() dto: CreateAdapterDto) {
    return this.service.create(dto);
  }

  @Get()
  async list(
    @Query('q') q?: string,
    @Query('baseModel') baseModel?: string,
    @Query('task') task?: string,
    @Query('sort') sort?: string
  ) {
    console.log('fetching data:', {
      q,
      baseModel,
      task,
      sort
    })
    return this.service.findWithFilters({ q, baseModel, task, sort });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
