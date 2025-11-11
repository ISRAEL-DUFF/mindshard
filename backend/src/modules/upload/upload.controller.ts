import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly service: UploadService) { }

  @Get('health')
  health() {
    return this.service.health();
  }
}
