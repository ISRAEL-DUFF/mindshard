import { useState } from 'react';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { walletManager } from '@/lib/wallet';

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  adapter: {
    id: string;
    name: string;
    price: number;
    creator: string;
    creatorAddress: string;
  };
}

export function PurchaseModal({ open, onClose, adapter }: PurchaseModalProps) {
  const [purchasing, setPurchasing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [decryptionKey, setDecryptionKey] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePurchase = async () => {
    const walletState = walletManager.getState();
    if (!walletState.connected) {
      toast({ title: 'Please connect your wallet first', variant: 'destructive' });
      return;
    }

    if (walletState.balance && walletState.balance < adapter.price) {
      toast({ title: 'Insufficient balance', variant: 'destructive' });
      return;
    }

    setPurchasing(true);
    try {
      // TODO: Implement actual Sui purchase transaction
      const mockTxHash = await walletManager.executeTransaction({
        type: 'purchase',
        adapterId: adapter.id,
        price: adapter.price,
        seller: adapter.creatorAddress,
      });
      
      setTxHash(mockTxHash);
      
      // Mock decryption key generation
      const mockDecryptionKey = `dk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      setDecryptionKey(mockDecryptionKey);
      
      toast({
        title: 'Purchase successful!',
        description: 'You can now download the adapter',
      });
      
      setPurchasing(false);
    } catch (error) {
      toast({
        title: 'Purchase failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      setPurchasing(false);
    }
  };

  const handleClose = () => {
    setTxHash(null);
    setDecryptionKey(null);
    onClose();
  };

  const royaltyAmount = adapter.price * 0.025; // 2.5% marketplace fee
  const creatorAmount = adapter.price - royaltyAmount;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle>Purchase Adapter</DialogTitle>
          <DialogDescription>
            Complete your purchase to download and use this adapter
          </DialogDescription>
        </DialogHeader>

        {!txHash ? (
          <div className="space-y-4 py-4">
            <div className="glass-panel p-4 rounded-lg space-y-3">
              <h3 className="font-semibold">{adapter.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold">{adapter.price} SUI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee (2.5%)</span>
                  <span>{royaltyAmount.toFixed(3)} SUI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Creator Receives</span>
                  <span>{creatorAmount.toFixed(3)} SUI</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border font-semibold">
                  <span>Total</span>
                  <span className="gradient-text">{adapter.price} SUI</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-3 rounded-lg text-sm">
              <p className="text-muted-foreground mb-2">After purchase you will:</p>
              <ul className="space-y-1 text-sm">
                <li>✓ Get download access to the adapter bundle</li>
                <li>✓ Receive decryption key for private adapters</li>
                <li>✓ Own an on-chain purchase receipt (NFT)</li>
                <li>✓ Support the creator directly</li>
              </ul>
            </div>

            <Button
              onClick={handlePurchase}
              disabled={purchasing}
              className="w-full bg-gradient-primary"
              size="lg"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {purchasing ? 'Processing...' : `Purchase for ${adapter.price} SUI`}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-1 mt-4">Purchase Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your transaction has been confirmed
              </p>
            </div>

            <div className="glass-panel p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Transaction</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">{txHash.substring(0, 10)}...</span>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {decryptionKey && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">🔑 Decryption Key</p>
                    <p className="text-sm text-muted-foreground">
                      Use this key to decrypt the adapter after download. Keep it secure!
                    </p>
                    <div className="bg-muted p-3 rounded font-mono text-sm break-all">
                      {decryptionKey}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(decryptionKey);
                        toast({ title: 'Copied to clipboard!' });
                      }}
                    >
                      Copy Key
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={handleClose} className="w-full" variant="outline">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
