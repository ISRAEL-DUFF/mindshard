import { Module } from '@nestjs/common';
import { WalrusService } from './walrus.service';
import { WalrusController } from './walrus.controller';
import { AdaptersModule } from '../adapters/adapters.module';
import { SuiModule } from '../sui/sui.module';

@Module({
  imports: [AdaptersModule, SuiModule],
  providers: [WalrusService],
  controllers: [WalrusController],
  exports: [WalrusService]
})
export class WalrusModule {}
