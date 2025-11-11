import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';

/**
 * WalrusService
 * - Contains helpers to interact with Walrus upload relay (browser-friendly) and server-side upload.
 * - NOTE: Replace relay URL and SDK calls with the official Walrus TS SDK if available.
 * - This implementation uses generic HTTP relay endpoints; adapt per Walrus SDK docs.
 */

@Injectable()
export class WalrusService {
  private readonly logger = new Logger(WalrusService.name);
  private relayUrl = process.env.WALRUS_RELAY_URL || '';
  private apiKey = process.env.WALRUS_API_KEY || '';

  constructor() {}

  /**
   * Request an upload session / token from Walrus relay (server-side).
   * This endpoint will return an upload URL or token the client can use to upload directly.
   */
  async initUploadSession(filename: string, size: number) {
    // Example: call relay for a presigned upload session
    // The exact request shape depends on Walrus relay API.
    // TODO: Replace endpoint and payload per Walrus docs.
    const url = `${this.relayUrl}/v1/upload/session`;
    try {
      const res = await axios.post(
        url,
        { filename, size },
        { headers: { 'Authorization': `Bearer ${this.apiKey}` } }
      );
      return res.data;
    } catch (e) {
      this.logger.error('initUploadSession failed', e);
      throw e;
    }
  }

  /**
   * Server-side upload helper for large files or worker uploads.
   * Streams file to relay and returns { cid, txDigest }.
   */
  async uploadFileServerSide(filePath: string) {
    try {
      const url = `${this.relayUrl}/v1/upload`;
      const filename = path.basename(filePath);
      
      // Create form with proper stream metadata
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath), {
        filename,
        contentType: 'application/octet-stream',
      });

      // Merge authorization and form headers
      const headers = {
        ...form.getHeaders(),
        Authorization: `Bearer ${this.apiKey}`,
      };

      const res = await axios.post(url, form, {
        headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      if (!res.data?.cid) {
        throw new Error('Upload response missing CID');
      }

      const data = res.data; // { cid, event: { txDigest } }
      console.log(data)
      return {
        cid: data.cid as string,
        event: data.event
      }
    } catch (e) {
      this.logger.error('uploadFileServerSide failed', e);
      throw e;
    }
  }

  /**
   * Query Walrus for blob metadata. Useful for verifying availability.
   */
  async getBlobInfo(cid: string) {
    try {
      const url = `${this.relayUrl}/v1/blob/${cid}`;
      const res = await axios.get(url);
      return res.data;
    } catch (e) {
      this.logger.error('getBlobInfo failed', e);
      throw e;
    }
  }
}
