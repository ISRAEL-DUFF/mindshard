import { Controller, Post, Body, BadRequestException, Get, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { WalrusService } from './walrus.service';
import { AdaptersService } from '../adapters/adapters.service';
import { SuiService } from '../sui/sui.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as os from 'os';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import { Express } from 'express';
import { ApiConsumes, ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';

/**
 * WalrusController
 * - POST /walrus/upload-init -> returns upload session (for client to upload directly to relay)
 * - POST /walrus/register -> called by client after upload to register CID + manifest (server verifies signature)
 * - GET /walrus/blob/:cid -> retrieve walrus blob metadata
 */

@ApiTags('walrus')
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

  @Post('upload-blob')
  @ApiOperation({ summary: 'Upload a blob to the Walrus relay' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        blobId: { type: 'string' },
        txId: { type: 'string' },
        nonce: { type: 'string' },
        deletableBlobObject: { type: 'string' },
        encodingType: { type: 'string' },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadBlob(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    // Accepts multipart/form-data with field name "file" and optional params in the form body.
    if (!file) throw new BadRequestException('file is required');

    const tmpDir = __dirname // process.env.TMPDIR || os.tmpdir();
    let filePath: string;
    let createdTmp = false;

    // If Multer wrote the file to disk, use that path.
    if ((file as any).path) {
      filePath = (file as any).path;
    } else if (file.buffer) {
      // write buffer to temp path
      filePath = path.join(tmpDir, `walrus-upload-${Date.now()}-${file.originalname}`);
      await fsPromises.writeFile(filePath, file.buffer);
      createdTmp = true;
    } else {
      throw new BadRequestException('uploaded file missing content');
    }

    try {
      const { blobId, txId, nonce, deletableBlobObject, encodingType } = body || {};
      console.log({
        filePath
      })
      const result = await this.walrus.uploadBlob({
        blobId,
        txId,
        nonce,
        filePath,
        deletableBlobObject,
        encodingType,
      });
      return result;
    } catch(e) {
      console.log(e);
      throw e
    }
    finally {
      if (createdTmp) {
        fsPromises.unlink(filePath).catch(() => {});
      }
    }
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
      walrusCID: cid,
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
