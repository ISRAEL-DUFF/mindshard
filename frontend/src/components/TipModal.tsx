import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { walletManager } from '@/lib/wallet';

interface TipModalProps {
  open: boolean;
  onClose: () => void;
  creatorAddress: string;
  creatorName: string;
}

export function TipModal({ open, onClose, creatorAddress, creatorName }: TipModalProps) {
  const [amount, setAmount] = useState('1.0');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    const walletState = walletManager.getState();
    if (!walletState.connected) {
      toast({ title: 'Please connect your wallet first', variant: 'destructive' });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: 'Please enter a valid amount', variant: 'destructive' });
      return;
    }

    setSending(true);
    try {
      // TODO: Implement actual Sui transaction for tipping
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Tip sent successfully!',
        description: `${amount} SUI sent to ${creatorName}`,
      });
      
      onClose();
      setAmount('1.0');
      setMessage('');
    } catch (error) {
      toast({
        title: 'Transaction failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle>Send Tip to {creatorName}</DialogTitle>
          <DialogDescription>
            Support this creator with a tip in SUI tokens
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (SUI)</Label>
            <Input
              id="amount"
              type="number"
              min="0.1"
              step="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1.0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Thanks for your amazing work!"
              rows={3}
            />
          </div>

          <div className="glass-panel p-3 rounded-lg space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Recipient</span>
              <span className="font-mono text-xs">{creatorAddress.substring(0, 10)}...{creatorAddress.substring(38)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network Fee</span>
              <span>~0.001 SUI</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-border">
              <span>Total</span>
              <span className="gradient-text">{(parseFloat(amount) + 0.001).toFixed(3)} SUI</span>
            </div>
          </div>

          <Button
            onClick={handleSend}
            disabled={sending || !amount}
            className="w-full bg-gradient-primary"
            size="lg"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            {sending ? 'Sending...' : 'Send Tip'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
