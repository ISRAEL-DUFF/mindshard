import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AdaptersService } from './adapters.service';
import { AdaptersController } from './adapters.controller';
import { Adapter } from './adapter.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Adapter])],
  controllers: [AdaptersController],
  providers: [AdaptersService],
  exports: [AdaptersService],
})
export class AdaptersModule { }
