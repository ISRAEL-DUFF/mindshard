// import { ConnectButton } from '@mysten/dapp-kit';

// export function WalletButton() {
// 	return <ConnectButton />;
// }

import { useState, useEffect } from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { walletManager } from '@/lib/wallet';
import { WalletState } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectButton, useDisconnectWallet } from '@mysten/dapp-kit';
import { useSuiClient } from '@mysten/dapp-kit';



export function WalletButton() {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const client = useSuiClient();

  const [walletState, setWalletState] = useState<WalletState>({ connected: false });
  const currentAccount = useCurrentAccount();
	const [open, setOpen] = useState(false);

  console.log(currentAccount, account, open)

  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = walletManager.subscribe(setWalletState);
    return () => {
      unsubscribe();
    }; 
  }, []);

  if(currentAccount) {
    setTimeout(async () => {
      await walletManager.updateConnectionInfo({
      address: currentAccount.address,
      client
    });
    }, 2000);
  }

  const handleConnect = async () => {
    try {
      setOpen(true);
      // await new Promise(resolve => setTimeout(resolve, 3000));
      // await walletManager.connect();
      // toast({
      //   title: 'Wallet Connected',
      //   description: `Address: ${walletState.address?.substring(0, 10)}...`,
      // });

      //     console.log("<<<<< OPEN: >>>", open)
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = async () => {
    disconnect()
    setTimeout(() => {
      walletManager.disconnectWalletState();
      toast({
        title: 'Wallet Disconnected',
      });
    }, 1500)
  };

  const handleConnectChange = async (isOpen) => {

  }

  if (walletState.connected) {
    return (
      <div className="flex items-center gap-2">
        <div className="glass-panel px-4 py-2 rounded-lg">
          <div className="text-xs text-muted-foreground">Balance</div>
          <div className="font-semibold gradient-text">
            {walletState.balance?.toFixed(2)} SUI
          </div>
        </div>
        <div className="glass-panel px-4 py-2 rounded-lg">
          <div className="text-xs text-muted-foreground">Address</div>
          <div className="font-mono text-sm">
            {/* {walletState.address?.substring(0, 6)}...{walletState.address?.substring(38)} */}
            {walletState.addressDisplay}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleDisconnect}>
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <ConnectModal
          trigger={
            <Button onClick={handleConnect} className="bg-gradient-primary">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
            // <button disabled={!!currentAccount}> {currentAccount ? 'Connected' : 'Connect'}</button>
          }
          open={open}
          onOpenChange={(isOpen) => setOpen(isOpen)}
        />
    // <ConnectButton />
    // <Button onClick={handleConnect} className="bg-gradient-primary">
    //   <Wallet className="h-4 w-4 mr-2" />
    //   Connect Wallet
    // </Button>
  );
}
