import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from './modules/auth/auth.module';
import { AdaptersModule } from './modules/adapters/adapters.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { WalrusModule } from './modules/walrus/walrus.module';
import { SuiModule } from './modules/sui/sui.module';
import config from '../mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    AuthModule,
    AdaptersModule,
    MarketplaceModule,
    WalrusModule,
    SuiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
