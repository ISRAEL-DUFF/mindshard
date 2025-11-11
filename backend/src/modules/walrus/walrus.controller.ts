import { Controller, Post, Body, BadRequestException, Get, Param } from '@nestjs/common';
import { WalrusService } from './walrus.service';
import { AdaptersService } from '../adapters/adapters.service';
import { SuiService } from '../sui/sui.service';

/**
 * WalrusController
 * - POST /walrus/upload-init -> returns upload session (for client to upload directly to relay)
 * - POST /walrus/register -> called by client after upload to register CID + manifest (server verifies signature)
 * - GET /walrus/blob/:cid -> retrieve walrus blob metadata
 */

@Controller('walrus')
export class WalrusController {
  constructor(
    private readonly walrus: WalrusService,
    private readonly adapters: AdaptersService,
    private readonly sui: SuiService
  ) {}

  @Post('upload-init')
  async init(@Body() body: any) {
    const { filename, size } = body;
    if (!filename || !size) throw new BadRequestException('filename and size required');
    return this.walrus.initUploadSession(filename, size);
  }

  @Post('register')
  async register(@Body() body: any) {
    // body: { cid, manifest, manifest_hash, signed_manifest, uploader_address, license }
    const { cid, manifest, manifest_hash, signed_manifest, uploader_address, license } = body;
    if (!cid || !manifest || !manifest_hash || !signed_manifest || !uploader_address) {
      throw new BadRequestException('missing fields');
    }

    // Verify signature (delegated to SuiService)
    const ok = await this.sui.verifyManifestSignature(JSON.stringify(manifest), signed_manifest, uploader_address);
    if (!ok) {
      throw new BadRequestException('invalid manifest signature');
    }

    // Persist adapter record in simple store and optionally create on-chain PTB for client to sign
    const adapter = await this.adapters.create({
      name: manifest.name || 'untitled',
      cid,
      manifestHash: manifest_hash,
      uploaderAddress: uploader_address,
      license: license || manifest.license || 'unknown'
    });

    // Optionally: prepare PTB for client to call publish_adapter; return calldata
    const ptb = await this.sui.preparePublishPTB(cid, manifest_hash, adapter.license);

    return { ok: true, adapterId: adapter.id, ptb };
  }

  @Get('blob/:cid')
  async blobInfo(@Param('cid') cid: string) {
    return this.walrus.getBlobInfo(cid);
  }
}
