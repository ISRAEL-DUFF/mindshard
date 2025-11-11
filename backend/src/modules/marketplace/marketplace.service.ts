import { Injectable } from '@nestjs/common';

@Injectable()
export class MarketplaceService {
  async listItem(body:any) {
    // TODO: persist listing, set price, royalty
    return { ok:true, listing: body };
  }

  async purchase(body:any) {
    // TODO: integrate Sui payment flow
    return { ok:true, tx: 'demo-tx-123', entitlement: 'demo-entitlement' };
  }
}
