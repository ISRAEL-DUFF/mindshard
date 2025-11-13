import { Module } from '@nestjs/common';
import { SuiService } from './sui.service';
import { SuiController } from './sui.controller';

@Module({
  providers: [SuiService],
  exports: [SuiService],
  controllers: [SuiController]
})
export class SuiModule {}
