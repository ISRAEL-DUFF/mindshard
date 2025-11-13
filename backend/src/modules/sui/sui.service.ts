import { Injectable, Logger } from '@nestjs/common';
// import { JsonRpcProvider, Ed25519Keypair, RawSigner, TransactionBlock, toB64, fromB64 } from '@mysten/sui/client';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519"
import { verifyPersonalMessageSignature } from '@mysten/sui/verify';
import { fromB64, toB64 } from '@mysten/sui/utils';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography'; 

// Assuming you have your backend's private key securely stored (e.g., in ENV vars)


/**
 * SuiService
 * - verifyManifestSignature: verifies a manifest signature (placeholder; adjust per wallet signing method)
 * - preparePublishPTB: prepares a TransactionBlock calling publish_adapter and returns serialized tx or call data
 *
 * Notes:
 * - Wallets often sign arbitrary messages differently. For SUI wallet signatures, use the wallet's signMessage
 *   and ensure the verification method matches the signature encoding. This code provides a pattern and
 *   includes TODOs where you may need to adapt to your client wallet behavior.
 */

@Injectable()
export class SuiService {
  private readonly logger = new Logger(SuiService.name);
  private provider: SuiJsonRpcClient;
  private platformPrivateKeyHex = process.env.PLATFORM_PRIVATE_KEY_HEX || '';

  constructor() {
    const rpc = process.env.SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443';
    this.provider = new SuiJsonRpcClient({ url: rpc });

    if (!process.env.PLATFORM_PRIVATE_KEY_HEX) throw new Error('PLATFORM_PRIVATE_KEY_HEX not configured');
  }

  /**
   * Verify a signed manifest.
   * @param manifestJson stringified manifest
   * @param signature base64 or hex signature produced by wallet
   * @param expectedAddress the Sui address the signature should recover
   *
   * NOTE: Wallets differ in how they sign messages. This function assumes the signature is an Ed25519
   * signature over the raw manifest bytes. Adjust to your wallet's format (some wallets prefix messages).
   */
  async verifyManifestSignature(manifestJson: string, signature: string, expectedAddress: string): Promise<boolean> {
    // TODO: implement proper verification using the wallet's public key recovery.
    // As a pragmatic hackathon fallback, if you already store uploader address in body and trust client,
    // return true. But for security, implement verification using @mysten/sui.js crypto utils.
    this.logger.warn('verifyManifestSignature is a placeholder; implement proper signature verification for production');
    return true;
  }

  /**
   * Prepare a PTB for the client to sign to publish adapter on-chain.
   * Returns serialized tx bytes (base64) or an object describing the moveCall arguments.
   */
  async preparePublishPTB(cid: string, manifestHash: string, license: string) {
    const tx = new Transaction();
    // Sui JS TransactionBlock supports pure, but to pass raw bytes you may need tx.pureBytes
    tx.moveCall({
      target: `0xPACKAGE_ID::adapter::publish_adapter`,
      arguments: [tx.pure("string", cid), tx.pure("string", manifestHash), tx.pure("string", license)],
    });
    // Return serialized tx for client to sign (they will replace PACKAGE_ID with real package)
    const serialized = await tx.build({ client: this.provider });
    // Note: tx.build() API may differ; you can also return the tx's moveCall data for client to construct.
    return { note: 'Replace PACKAGE_ID with published package id', tx: '<serialized-ptb-placeholder>' };
  }

  /**
   * Lightweight health check for the Sui provider
   */
  health() {
    return {
      ok: true,
      rpc: this.provider ? (this.provider as any).url || 'configured' : 'not-configured',
    };
  }

  /**
   * Optional: server-side mint using platform key (not recommended for attribution).
   */ 
  async mintAdapterServerSide(cid: string, manifestHash: string, license: string) {
    if (!this.platformPrivateKeyHex) throw new Error('PLATFORM_PRIVATE_KEY_HEX not configured');
    const key = Ed25519Keypair.fromSecretKey(Uint8Array.from(Buffer.from(this.platformPrivateKeyHex, 'hex')));
    // const signer = new RawSigner(key, this.provider as any);
    const tx = new Transaction();
    tx.moveCall({
      target: `0xa570938509a03fcfdb3e231b1b47f776018cca972528b173ed18927d2940af9f::adapter::publish_adapter`,
      arguments: [tx.pure("string", cid), tx.pure("string", manifestHash), tx.pure("string", license)],
    });
    const res = await this.provider.signAndExecuteTransaction({ transaction: tx, signer: key });
    return res;
  }

  async mintAdapterServerSide2(params: {cid: string, manifestHash: string, license: string, signature: string, txBytes: string}) {
    const tx = new Transaction();
    tx.moveCall({
      target: `0xa570938509a03fcfdb3e231b1b47f776018cca972528b173ed18927d2940af9f::adapter::publish_adapter`,
      arguments: [tx.pure("string", params.cid), tx.pure("string", params.manifestHash), tx.pure("string", params.license)],
    });
    const res = await this.provider.executeTransactionBlock({ transactionBlock: params.txBytes, signature: params.signature });
    return res;
  }

  async mintAdapterResource(params: {cid: string, manifestHash: string, uploaderAddress: string, license: string, signature: string, messageBytesBase64: string}) {
    const { uploaderAddress, signature, messageBytesBase64 , license, cid, manifestHash} = params;
    const messageBytes = fromB64(messageBytesBase64); // Decode the original bytes

    // 1. Verify the signature locally on the backend
    try {
      // verifyPersonalMessage function checks the signature against the message bytes 
      // and returns the signer's public key if valid.
      const isValid = await verifyPersonalMessageSignature(messageBytes, signature, {
        address: uploaderAddress
      });

      if (!isValid) {
       throw new Error('Invalid signature. Unauthorized mint request.');
      }
    } catch (error) {
      console.log(error);
      throw error;
    }

    // 2. Signature is valid. Proceed with backend-initiated minting.
    try {
      if (!this.platformPrivateKeyHex) throw new Error('PLATFORM_PRIVATE_KEY_HEX not configured');
      const backendKeypair = Ed25519Keypair.fromSecretKey(decodeSuiPrivateKey(this.platformPrivateKeyHex).secretKey);
      const backendAddress =  backendKeypair.getPublicKey().toSuiAddress();

      // --- Add this logic to find a gas coin ID ---
      const availableCoins = await this.provider.getCoins({ owner: backendAddress });
      console.log("ADDRESS:", backendAddress)

      if (availableCoins.data.length === 0) {
          throw new Error("Found coins list is empty, you definitely don't have funds.");
      }

      // 3. Sign and execute the transaction using the BACKEND'S keypair
      const tx = new Transaction();
      tx.setSender(backendAddress);
      tx.setGasBudget(30000000); // 1 Million MIST (0.001 SUI) is usually enough
      tx.moveCall({
        target: `0x6bf72fd97d4835d5ebfc569db2117306b9a2f6251d23ab8cd6f1c02509bbec7b::adapter::publish_adapter`,
        arguments: [tx.pure("string", cid), tx.pure("string", manifestHash), tx.pure("string", license), tx.pure("address", uploaderAddress)],
      });
      const txResponse = await this.provider.signAndExecuteTransaction({ transaction: tx, signer: backendKeypair, options: { showEffects: true } });

      return { 
        message: 'Resource minted successfully!', 
        digest: txResponse.digest,
      };

    } catch (error) {
      console.error('Minting failed:', error);
      throw new Error('Minting failed on chain: ' + error.message)
    }
  }
}
