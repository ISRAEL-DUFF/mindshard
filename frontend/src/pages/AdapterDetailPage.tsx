import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Download, Shield, GitFork, DollarSign, ExternalLink, CheckCircle2, AlertCircle, Heart, Upload } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { TipModal } from '@/components/TipModal';
import { PurchaseModal } from '@/components/PurchaseModal';
import { VersionDiff } from '@/components/VersionDiff';
import { NewVersionModal } from '@/components/NewVersionModal';
import { walletManager } from '@/lib/wallet';
import { adapterApi } from '@/lib/api';

export default function AdapterDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [newVersionModalOpen, setNewVersionModalOpen] = useState(false);
  const [compareVersions, setCompareVersions] = useState<{ old: any; new: any } | null>(null);


  const [adapter, setAdapter] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    adapterApi.getById(id)
      .then(setAdapter)
      .catch((err) => setError(err.message || 'Failed to load adapter'))
      .finally(() => setLoading(false));
  }, [id]);
  
  const walletState = walletManager.getState();
  const isCreator = adapter && walletState.connected && walletState.address === adapter.creatorAddress;

  const handleVerify = async () => {
    setVerifying(true);
    // TODO: Implement actual verification
    setTimeout(() => {
      setVerified(true);
      setVerifying(false);
      toast({ title: 'Verification successful!', description: 'Adapter is authentic and secure' });
    }, 2000);
  };

  const handleDownload = () => {
    toast({ title: 'Download started', description: 'Your adapter is being prepared' });
  };

  const handlePurchase = () => {
    setPurchaseModalOpen(true);
  };

  const handleTip = () => {
    setTipModalOpen(true);
  };

  const handleFork = () => {
    navigate('/upload', { 
      state: { 
        parentId: adapter.id,
        isFork: true,
        parentAdapter: {
          name: adapter.name,
          description: adapter.description,
          baseModel: adapter.baseModel,
          task: adapter.task,
          language: adapter.language,
          license: adapter.license,
          version: adapter.version,
        }
      } 
    });
  };

  const handleNewVersion = () => {
    setNewVersionModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-lg text-muted-foreground">Loading adapter...</span>
      </div>
    );
  }

  if (error || !adapter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-lg text-destructive">{error || 'Adapter not found.'}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold">{adapter.name}</h1>
                    {adapter.verified && <Shield className="h-6 w-6 text-primary" />}
                  </div>
                  <p className="text-muted-foreground">
                    by <Link to={`/profile/${adapter.creator}`} className="text-foreground hover:underline">
                      {adapter.creator}
                    </Link>
                    <span className="mx-2">•</span>
                    v{adapter.version}
                  </p>
                </div>
                {isCreator && (
                  <Button onClick={handleNewVersion} variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    New Version
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{adapter.baseModel}</Badge>
                <Badge variant="outline">{adapter.task}</Badge>
                <Badge variant="outline">{adapter.language}</Badge>
                <Badge variant="outline">{adapter.license}</Badge>
                {adapter.tags && adapter.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>

              <p className="text-lg">{adapter.description}</p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="glass-panel">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="manifest">Manifest</TabsTrigger>
                <TabsTrigger value="versions">Versions</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle>Verification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Manifest Hash</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {adapter.manifestHash?.substring(0, 20)}...
                        </p>
                      </div>
                      <Button
                        onClick={handleVerify}
                        disabled={verifying}
                        variant={verified ? 'default' : 'outline'}
                      >
                        {verified ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Verified
                          </>
                        ) : (
                          'Verify Adapter'
                        )}
                      </Button>
                    </div>

                    {verified !== null && (
                      <div className={`p-4 rounded-lg ${verified ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                        <div className="flex items-center gap-2">
                          {verified ? (
                            <>
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                              <span className="font-medium">Verification passed</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-5 w-5 text-destructive" />
                              <span className="font-medium">Verification failed</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle>Storage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Walrus CID</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{adapter.walrusCID?.substring(0, 20)}...</span>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manifest" className="space-y-4">
                <Card className="glass-panel">
                  <CardContent className="p-6">
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify({
                        name: adapter.name,
                        version: adapter.version,
                        baseModel: adapter.baseModel,
                        task: adapter.task,
                        license: adapter.license,
                        author: adapter.creatorAddress,
                      }, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="versions" className="space-y-4">
                {compareVersions ? (
                  <div className="space-y-4">
                    <Button variant="outline" onClick={() => setCompareVersions(null)}>
                      Back to Versions
                    </Button>
                    <VersionDiff oldVersion={compareVersions.old} newVersion={compareVersions.new} />
                  </div>
                ) : (
                  <>
                    {adapter.versions && adapter.versions.map((version: any, idx: number) => (
                      <Card key={version.version} className="glass-panel">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold">v{version.version}</h3>
                                {idx === 0 && <Badge variant="default">Latest</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">{version.createdAt}</p>
                              <p className="text-xs font-mono text-muted-foreground mt-1">
                                CID: {version.walrusCID?.substring(0, 30)}...
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {idx < adapter.versions.length - 1 && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setCompareVersions({
                                    old: adapter.versions[idx + 1],
                                    new: version,
                                  })}
                                >
                                  Compare
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
              </TabsContent>

              <TabsContent value="usage" className="space-y-4">
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle>CLI Installation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                      {`mindshard-client download ${adapter.id}\nmindshard-client load ${adapter.id} --base-model ${adapter.baseModel}`}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="glass-panel">
              <CardContent className="p-6 space-y-4">
                {adapter.price > 0 ? (
                  <>
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold gradient-text mb-2">
                        {adapter.price} SUI
                      </div>
                      <p className="text-sm text-muted-foreground">Premium Adapter</p>
                    </div>
                    <Button onClick={handlePurchase} className="w-full bg-gradient-primary" size="lg">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Purchase
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleDownload} className="w-full bg-gradient-primary" size="lg">
                    <Download className="h-5 w-5 mr-2" />
                    Download Free
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleTip}>
                    <Heart className="h-4 w-4 mr-2" />
                    Tip Creator
                  </Button>
                  <Button variant="outline" onClick={handleFork}>
                    <GitFork className="h-4 w-4 mr-2" />
                    Fork
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Downloads</span>
                  <span className="font-semibold">{adapter.downloads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchases</span>
                  <span className="font-semibold">{adapter.purchases}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-semibold">{adapter.createdAt}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <TipModal
        open={tipModalOpen}
        onClose={() => setTipModalOpen(false)}
        creatorAddress={adapter.creatorAddress}
        creatorName={adapter.creator}
      />

      <PurchaseModal
        open={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
        adapter={{
          id: adapter.id,
          name: adapter.name,
          price: adapter.price,
          creator: adapter.creator,
          creatorAddress: adapter.creatorAddress,
        }}
      />

      <NewVersionModal
        open={newVersionModalOpen}
        onClose={() => setNewVersionModalOpen(false)}
        adapterId={adapter.id}
        adapterName={adapter.name}
        currentVersion={adapter.version}
      />
    </div>
  );
}
