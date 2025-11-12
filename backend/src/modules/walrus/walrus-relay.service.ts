import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class WalrusRelayService {
//   private readonly relayUrl = 'https://upload-relay.mainnet.walrus.space/v1/blob-upload-relay';
  private readonly relayUrl = 'https://upload-relay.devnet.walrus.space/v1/blob-upload-relay';

  async uploadBlob({
    blobId,
    txId,
    nonce,
    filePath,
    deletableBlobObject,
    encodingType = 'RS2', // optional
  }: {
    blobId: string;
    txId: string;
    nonce: string;
    filePath: string;
    deletableBlobObject?: string;
    encodingType?: string;
  }) {
    // Build query params
    const params = new URLSearchParams({
      blob_id: blobId,
      tx_id: txId,
      nonce,
    });
    if (deletableBlobObject) params.append('deletable_blob_object', deletableBlobObject);
    if (encodingType) params.append('encoding_type', encodingType);

    // Read file as binary
    const fileStream = fs.createReadStream(filePath);

    // Send POST request
    const response = await axios.post(
      `${this.relayUrl}?${params.toString()}`,
      fileStream,
      {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      },
    );

    return response.data; // Contains blob_id and confirmation_certificate
  }
}


/*

// In your controller or another service
const result = await walrusRelayService.uploadBlob({
  blobId: 'your_blob_id',
  txId: 'your_tx_id',
  nonce: 'your_nonce',
  filePath: '/path/to/your/file.bin',
});
console.log(result);

*/
