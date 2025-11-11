// Sui wallet integration utilities
// TODO: Install @mysten/sui.js and wallet adapter packages

import { WalletState } from './types';
import { ConnectButton, useConnectWallet, useWallets, WalletWithFeatures } from '@mysten/dapp-kit';

export class WalletManager {
  private listeners: Set<(state: WalletState) => void> = new Set();
  private state: WalletState = { connected: false };
  // Initialize the Sui client for a specific network (e.g., 'mainnet', 'testnet')
  // private client: SuiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });
  private client;

  subscribe(listener: (state: WalletState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  async connect(): Promise<void> {
    try {
      await this._connect();
      
      this.state = {
        connected: true,
        address: '0x' + Math.random().toString(16).substring(2, 42),
        balance: Math.random() * 1000,
      };
      this.notify();
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  async updateConnectionInfo(walletInfo: {
    address: string;
    client: any
  }) {
    try {
      this.client = walletInfo.client;
      this.state = {
        connected: true,
        address: walletInfo.address,
        addressDisplay: `${walletInfo.address.substring(0, 6)}...${walletInfo.address.substring(walletInfo.address.length - 4)}`,
        balance: await this.userAccountBalance(walletInfo.address),
      };
      this.notify();
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.state = { connected: false };
    this.notify();
  }

  disconnectWalletState() {
    this.state = { connected: false };
    this.notify();
  }

  async signMessage(message: string): Promise<string> {
    if (!this.state.connected) {
      throw new Error('Wallet not connected');
    }

    // TODO: Implement actual message signing with Sui wallet
    // Example: const signature = await wallet.signMessage(message);
    
    // Mock signature for demo
    await new Promise(resolve => setTimeout(resolve, 500));
    return 'mock-signature-' + btoa(message).substring(0, 64);
  }

  async executeTransaction(txData: any): Promise<string> {
    if (!this.state.connected) {
      throw new Error('Wallet not connected');
    }

    // TODO: Implement actual Sui transaction execution
    // Example: const result = await wallet.signAndExecuteTransaction(txData);
    
    // Mock transaction for demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    return '0x' + Math.random().toString(16).substring(2, 66);
  }

  getState(): WalletState {
    return this.state;
  }

  async userAccountBalance(userAddress: string): Promise<number> {
    try {
      // Get the SUI balance for the address
      // This returns the balance in MIST (as a BigInt)
      const balanceResult = await this.client.getBalance({
        owner: userAddress,
        coinType: '0x2::sui::SUI', // Default, but good practice to specify
      });

      const mistBalance = BigInt(balanceResult.totalBalance);

      // Convert MIST to SUI (1 SUI = 10^9 MIST)
      const suiBalance = Number(mistBalance) / (10 ** 9);

      console.log(`Account Balance: ${suiBalance} SUI`);
      return suiBalance;

    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  }

  private async _connect(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
            const wallets = useWallets();
            const { mutate: walletConnect } = useConnectWallet();

            if(!wallets[0]) {
              return reject(new Error("No Wallet Found"))
            }
          
            walletConnect(
              { wallet: wallets[0] },
              {
                onSuccess: () => {
                  console.log('connected');
                  resolve(wallets[0].accounts[0].address);
                },
                onError: (e) => reject(e)
              },
            );          
          } catch (error) {
            console.error('Wallet connection failed:', error);
            reject(error);
          }
    })
  }
}

export const walletManager = new WalletManager();
