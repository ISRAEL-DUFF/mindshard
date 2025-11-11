import { Controller, Get, Post, Body } from '@nestjs/common';
import { SuiService } from './sui.service';

class VerifyManifestDto {
  manifestJson!: string;
  signature!: string;
  expectedAddress!: string;
}

class PreparePublishDto {
  cid!: string;
  manifestHash!: string;
  license!: string;
}

@Controller('sui')
export class SuiController {
  constructor(private readonly service: SuiService) { }

  @Get('health')
  health() {
    return this.service.health();
  }

  @Post('verify')
  async verifyManifest(@Body() body: VerifyManifestDto) {
    const { manifestJson, signature, expectedAddress } = body;
    const ok = await this.service.verifyManifestSignature(manifestJson, signature, expectedAddress);
    return { ok };
  }

  @Post('prepare-publish')
  async preparePublish(@Body() body: PreparePublishDto) {
    const { cid, manifestHash, license } = body;
    const res = await this.service.preparePublishPTB(cid, manifestHash, license);
    return res;
  }

  @Post('mint')
  async mintAdapter(@Body() body: PreparePublishDto) {
    const { cid, manifestHash, license } = body;
    const res = await this.service.mintAdapterServerSide(cid, manifestHash, license);
    return res;
  }
}
