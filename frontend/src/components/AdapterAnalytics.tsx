import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Download, ShoppingCart, CheckCircle2, XCircle } from 'lucide-react';

interface AdapterAnalyticsProps {
  adapterId: string;
  adapterName: string;
  analytics: {
    downloads: number;
    purchases: number;
    verificationsPass: number;
    verificationsFail: number;
    earningsTotal: number;
    downloadTrend: number;
  };
}

export function AdapterAnalytics({ adapterName, analytics }: AdapterAnalyticsProps) {
  const totalVerifications = analytics.verificationsPass + analytics.verificationsFail;
  const verificationRate = totalVerifications > 0 
    ? ((analytics.verificationsPass / totalVerifications) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-1">{adapterName}</h3>
        <p className="text-sm text-muted-foreground">Performance analytics</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.downloads}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              {analytics.downloadTrend > 0 ? '+' : ''}{analytics.downloadTrend}% this month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Purchases
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.purchases}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.earningsTotal} SUI earned
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verification Rate
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verificationRate}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.verificationsPass} pass / {analytics.verificationsFail} fail
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Verification Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 glass-panel rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Successful Verifications</p>
                <p className="text-sm text-muted-foreground">Users verified authenticity</p>
              </div>
            </div>
            <span className="text-2xl font-bold">{analytics.verificationsPass}</span>
          </div>

          <div className="flex items-center justify-between p-3 glass-panel rounded-lg">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium">Failed Verifications</p>
                <p className="text-sm text-muted-foreground">Possible integrity issues</p>
              </div>
            </div>
            <span className="text-2xl font-bold">{analytics.verificationsFail}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
