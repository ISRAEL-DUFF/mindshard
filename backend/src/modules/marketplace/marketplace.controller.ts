import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly svc: MarketplaceService) {}

  @Post('list')
  list(@Body() body: any) {
    return this.svc.listItem(body);
  }

  @Post('purchase')
  purchase(@Body() body: any) {
    return this.svc.purchase(body);
  }

  @Get('health')
  health() { return { ok:true }; }
}
