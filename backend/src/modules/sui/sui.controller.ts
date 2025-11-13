import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { SuiService } from './sui.service';
import { MintAdapterDto, PreparePublishDto, VerifyManifestDto } from './dto';
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
  async mintAdapter(@Body() body: MintAdapterDto) {
    const {walrusCID, manifest, manifestHash, signature, messageBytesBase64, uploaderAddress, name} = body;
    const license = manifest.license;
    const res = await this.service.mintAdapterResource({
      cid: walrusCID,
      manifestHash,
      license,
      signature,
      messageBytesBase64,
      uploaderAddress
    });
    return res;
  }
}
