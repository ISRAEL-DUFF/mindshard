import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { AdapterCard } from '@/components/AdapterCard';
import { PurchaseHistory } from '@/components/PurchaseHistory';
import { AdapterAnalytics } from '@/components/AdapterAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Download, DollarSign, Heart, Upload, Edit, Trash2, Eye } from 'lucide-react';

export default function DashboardPage() {
  const [selectedAdapter, setSelectedAdapter] = useState<string | null>(null);

  // Mock data - TODO: Fetch from API
  const purchases = [
    {
      id: '1',
      adapterId: '2',
      adapterName: 'GPT-4 Style Adapter',
      price: 10,
      txHash: '0xabcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd1234',
      timestamp: '2024-01-18T10:30:00Z',
      seller: 'alice.sui',
    },
    {
      id: '2',
      adapterId: '3',
      adapterName: 'Llama Fine-tune v2',
      price: 5,
      txHash: '0x1234abcd567890abcd1234567890abcd1234567890abcd1234567890abcd5678',
      timestamp: '2024-01-15T14:20:00Z',
      seller: 'bob.sui',
    },
  ];

  const stats = {
    totalEarnings: 145.5,
    totalDownloads: 3421,
    totalPurchases: 89,
    totalTips: 23.2,
  };

  const myAdapters = [
    {
      id: '1',
      name: 'GPT-4 Style Adapter',
      description: 'Fine-tuned adapter for GPT-like writing',
      baseModel: 'llama-2-7b',
      downloads: 1234,
      purchases: 45,
      earnings: 85.5,
      price: 10,
      verified: true,
      isPrivate: true,
      versions: 3,
    },
    {
      id: '4',
      name: 'Code Generation Adapter',
      description: 'Optimized for code completion',
      baseModel: 'codellama-7b',
      downloads: 856,
      purchases: 32,
      earnings: 48.0,
      price: 5,
      verified: true,
      isPrivate: true,
      versions: 2,
    },
    {
      id: '5',
      name: 'Creative Writing v2',
      description: 'Enhanced creative writing capabilities',
      baseModel: 'llama-2-13b',
      downloads: 1331,
      purchases: 0,
      earnings: 0,
      price: 0,
      verified: false,
      isPrivate: false,
      versions: 2,
    },
  ];

  const adapterAnalytics = {
    '1': {
      downloads: 1234,
      purchases: 45,
      verificationsPass: 1180,
      verificationsFail: 12,
      earningsTotal: 85.5,
      downloadTrend: 15,
    },
    '4': {
      downloads: 856,
      purchases: 32,
      verificationsPass: 820,
      verificationsFail: 8,
      earningsTotal: 48.0,
      downloadTrend: 8,
    },
    '5': {
      downloads: 1331,
      purchases: 0,
      verificationsPass: 1298,
      verificationsFail: 5,
      earningsTotal: 0,
      downloadTrend: 22,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Creator <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Manage your adapters and track your earnings
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="glass-panel">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Earnings
                </CardTitle>
                <DollarSign className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text">
                  {stats.totalEarnings} SUI
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Downloads
                </CardTitle>
                <Download className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text">
                  {stats.totalDownloads}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all adapters
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Purchases
                </CardTitle>
                <DollarSign className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text">
                  {stats.totalPurchases}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Premium adapters sold
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tips Received
                </CardTitle>
                <Heart className="h-5 w-5 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text">
                  {stats.totalTips} SUI
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  From the community
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="adapters" className="w-full">
            <TabsList className="glass-panel">
              <TabsTrigger value="adapters">My Adapters</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="adapters" className="space-y-6">
              {myAdapters.length > 0 ? (
                <div className="space-y-4">
                  {myAdapters.map((adapter) => (
                    <Card key={adapter.id} className="glass-panel">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{adapter.name}</h3>
                              {adapter.verified && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Verified</span>
                              )}
                              {adapter.isPrivate && (
                                <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">Premium</span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{adapter.description}</p>
                            
                            <div className="grid grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Downloads</p>
                                <p className="text-lg font-semibold">{adapter.downloads}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Purchases</p>
                                <p className="text-lg font-semibold">{adapter.purchases}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Earnings</p>
                                <p className="text-lg font-semibold gradient-text">{adapter.earnings} SUI</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Versions</p>
                                <p className="text-lg font-semibold">{adapter.versions}</p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Link to={`/adapter/${adapter.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Listing
                              </Button>
                              <Button variant="outline" size="sm">
                                <Upload className="h-4 w-4 mr-2" />
                                New Version
                              </Button>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No adapters yet. Upload your first adapter to get started!</p>
                  <Link to="/upload">
                    <Button className="bg-gradient-primary">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Adapter
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="purchases" className="space-y-6">
              <PurchaseHistory purchases={purchases} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {myAdapters.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Select
                      value={selectedAdapter || myAdapters[0]?.id}
                      onValueChange={setSelectedAdapter}
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select adapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {myAdapters.map((adapter) => (
                          <SelectItem key={adapter.id} value={adapter.id}>
                            {adapter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(() => {
                    const adapterToShow = myAdapters.find(
                      (a) => a.id === (selectedAdapter || myAdapters[0]?.id)
                    );
                    const analytics = adapterToShow 
                      ? adapterAnalytics[adapterToShow.id as keyof typeof adapterAnalytics]
                      : null;

                    return adapterToShow && analytics ? (
                      <AdapterAnalytics
                        adapterId={adapterToShow.id}
                        adapterName={adapterToShow.name}
                        analytics={analytics}
                      />
                    ) : null;
                  })()}
                </div>
              ) : (
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle>Performance Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground text-center py-12">
                      Upload an adapter to see analytics
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
