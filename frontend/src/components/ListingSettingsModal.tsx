import { useState } from 'react';
import { Settings, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ListingSettingsModalProps {
  open: boolean;
  onClose: () => void;
  adapter: {
    id: string;
    name: string;
    price?: number;
    isPrivate: boolean;
  };
}

export function ListingSettingsModal({ open, onClose, adapter }: ListingSettingsModalProps) {
  const [settings, setSettings] = useState({
    isListed: true,
    price: adapter.price || 0,
    currency: 'SUI',
    isPrivate: adapter.isPrivate,
    royaltyPercentage: 10,
    allowCommercialUse: true,
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Implement actual listing update API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Listing updated!',
        description: 'Your adapter marketplace settings have been saved',
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-panel max-w-2xl">
        <DialogHeader>
          <DialogTitle>Marketplace Settings</DialogTitle>
          <DialogDescription>
            Configure pricing and licensing for {adapter.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between glass-panel p-4 rounded-lg">
            <div>
              <Label htmlFor="listed">List on Marketplace</Label>
              <p className="text-sm text-muted-foreground">
                Make this adapter discoverable and available for purchase
              </p>
            </div>
            <Switch
              id="listed"
              checked={settings.isListed}
              onCheckedChange={(checked) => setSettings({ ...settings, isListed: checked })}
            />
          </div>

          {settings.isListed && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.1"
                    value={settings.price}
                    onChange={(e) => setSettings({ ...settings, price: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => setSettings({ ...settings, currency: value })}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUI">SUI</SelectItem>
                      <SelectItem value="USDC">USDC (coming soon)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="royalty">Royalty Percentage (for secondary sales)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="royalty"
                    type="number"
                    min="0"
                    max="25"
                    step="0.5"
                    value={settings.royaltyPercentage}
                    onChange={(e) => setSettings({ ...settings, royaltyPercentage: parseFloat(e.target.value) })}
                    className="max-w-[120px]"
                  />
                  <span className="text-sm text-muted-foreground">
                    You'll receive {settings.royaltyPercentage}% of future resales
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between glass-panel p-4 rounded-lg">
                <div>
                  <Label htmlFor="private">Private/Encrypted</Label>
                  <p className="text-sm text-muted-foreground">
                    Encrypt adapter and provide key only after purchase
                  </p>
                </div>
                <Switch
                  id="private"
                  checked={settings.isPrivate}
                  onCheckedChange={(checked) => setSettings({ ...settings, isPrivate: checked })}
                />
              </div>

              <div className="flex items-center justify-between glass-panel p-4 rounded-lg">
                <div>
                  <Label htmlFor="commercial">Allow Commercial Use</Label>
                  <p className="text-sm text-muted-foreground">
                    Permit buyers to use adapter for commercial projects
                  </p>
                </div>
                <Switch
                  id="commercial"
                  checked={settings.allowCommercialUse}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowCommercialUse: checked })}
                />
              </div>

              <div className="glass-panel p-4 rounded-lg space-y-2">
                <h4 className="font-semibold text-sm">Revenue Breakdown</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sale Price</span>
                    <span>{settings.price} {settings.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee (2.5%)</span>
                    <span>{(settings.price * 0.025).toFixed(3)} {settings.currency}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-border">
                    <span>You Receive</span>
                    <span className="gradient-text">{(settings.price * 0.975).toFixed(3)} {settings.currency}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-gradient-primary"
            >
              <Settings className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
