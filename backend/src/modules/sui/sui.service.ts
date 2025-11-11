import { Injectable, Logger } from '@nestjs/common';
// import { JsonRpcProvider, Ed25519Keypair, RawSigner, TransactionBlock, toB64, fromB64 } from '@mysten/sui/client';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519"


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
    // this.provider = new JsonRpcProvider({ url: rpc, rpc });
    this.provider = new SuiJsonRpcClient({ url: rpc });
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
      target: `0xPACKAGE_ID::adapter::publish_adapter`,
      arguments: [tx.pure("string", cid), tx.pure("string", manifestHash), tx.pure("string", license)],
    });
    const res = await this.provider.signAndExecuteTransaction({ transaction: tx, signer: key });
    return res;
  }
}
