import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Purchase {
  id: string;
  adapterId: string;
  adapterName: string;
  price: number;
  txHash: string;
  timestamp: string;
  seller: string;
}

interface PurchaseHistoryProps {
  purchases: Purchase[];
}

export function PurchaseHistory({ purchases }: PurchaseHistoryProps) {
  if (purchases.length === 0) {
    return (
      <Card className="glass-panel">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No purchases yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {purchases.map((purchase) => (
        <Card key={purchase.id} className="glass-panel">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link to={`/adapter/${purchase.adapterId}`} className="hover:underline">
                  <h3 className="font-semibold text-lg mb-1">{purchase.adapterName}</h3>
                </Link>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>{new Date(purchase.timestamp).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="font-semibold text-foreground">{purchase.price} SUI</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Transaction:</span>
                  <code className="font-mono bg-muted px-2 py-1 rounded">
                    {purchase.txHash.substring(0, 16)}...
                  </code>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">Owned</Badge>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
