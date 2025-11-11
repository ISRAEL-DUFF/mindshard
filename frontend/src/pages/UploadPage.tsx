import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { FileUpload } from '@/components/FileUpload';
import { UploadProgress } from '@/components/UploadProgress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UploadProgress as UploadProgressType, AdapterManifest } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { computeBufferSHA256, computeManifestHash, validateZipBundle } from '@/lib/crypto';
import { walletManager } from '@/lib/wallet';
import { uploadApi } from '@/lib/api';
import { AlertCircle, ExternalLink } from 'lucide-react';

export default function UploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgressType | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [extractedManifest, setExtractedManifest] = useState<AdapterManifest | null>(null);
  const [txResult, setTxResult] = useState<{ adapterId: string; txHash: string } | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [isNewVersion, setIsNewVersion] = useState(false);
  const [isFork, setIsFork] = useState(false);
  const [changelog, setChangelog] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    baseModel: '',
    task: '',
    language: 'en',
    license: 'MIT',
    isPrivate: false,
    price: 0,
  });
  const { toast } = useToast();

  // Handle parent adapter context (fork or new version)
  useEffect(() => {
    const state = location.state as any;
    if (!state) return;

    if (state.isNewVersion) {
      setIsNewVersion(true);
      setParentId(state.parentId);
      setChangelog(state.changelog || '');
      if (state.file) {
        handleFileSelect(state.file);
      }
    } else if (state.isFork && state.parentAdapter) {
      setIsFork(true);
      setParentId(state.parentId);
      const parent = state.parentAdapter;
      setFormData({
        name: `${parent.name} (Fork)`,
        description: `Forked from ${parent.name}. ${parent.description}`,
        baseModel: parent.baseModel,
        task: parent.task,
        language: parent.language,
        license: parent.license,
        isPrivate: false,
        price: 0,
      });
      toast({
        title: 'Fork initialized',
        description: `Creating a fork of ${parent.name}`,
      });
    }
  }, [location.state]);

  // Handle file selection and validation
  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setValidationErrors([]);
    setExtractedManifest(null);
    setTxResult(null);

    // Validate zip bundle
    try {
      const validation = await validateZipBundle(selectedFile);
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        toast({
          title: 'Invalid bundle',
          description: validation.errors.join(', '),
          variant: 'destructive',
        });
        return;
      }

      if (validation.manifest) {
        setExtractedManifest(validation.manifest);
        // Pre-fill form with manifest data
        setFormData({
          name: validation.manifest.name || '',
          description: validation.manifest.description || '',
          baseModel: validation.manifest.baseModel || '',
          task: validation.manifest.task || '',
          language: validation.manifest.language || 'en',
          license: validation.manifest.license || 'MIT',
          isPrivate: false,
          price: 0,
        });
      }

      toast({
        title: 'Bundle validated',
        description: 'All required files found and validated successfully',
      });
    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: 'Validation failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ title: 'No file selected', variant: 'destructive' });
      return;
    }

    if (validationErrors.length > 0) {
      toast({ title: 'Please fix validation errors first', variant: 'destructive' });
      return;
    }

    if (!formData.name || !formData.description || !formData.baseModel || !formData.task) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    const walletState = walletManager.getState();
    if (!walletState.connected) {
      toast({ 
        title: 'Wallet not connected', 
        description: 'Please connect your Sui wallet to continue',
        variant: 'destructive' 
      });
      return;
    }

    setUploading(true);
    setTxResult(null);

    try {
      // Stage 1: Preparing and validating
      setProgress({ stage: 'preparing', progress: 5, message: 'Validating bundle structure...' });
      
      const validation = await validateZipBundle(file);
      if (!validation.isValid || !validation.manifest || !validation.adapterFile || !validation.configFile) {
        throw new Error('Invalid bundle structure');
      }

      setProgress({ stage: 'preparing', progress: 15, message: 'Bundle validated successfully' });
      
      // Stage 2: Computing checksums
      setProgress({ stage: 'hashing', progress: 25, message: 'Computing adapter file checksum...' });
      const adapterHash = await computeBufferSHA256(validation.adapterFile);
      
      setProgress({ stage: 'hashing', progress: 35, message: 'Computing config file checksum...' });
      const configHash = await computeBufferSHA256(validation.configFile);
      
      setProgress({ stage: 'hashing', progress: 45, message: 'Computing manifest hash...' });
      
      // Create final manifest with computed checksums
      const manifest: AdapterManifest = {
        ...validation.manifest,
        name: formData.name,
        description: formData.description,
        baseModel: formData.baseModel,
        task: formData.task,
        language: formData.language,
        license: formData.license,
        author: walletState.address!,
        checksums: {
          adapter: adapterHash,
          config: configHash,
        },
      };
      
      const manifestHash = await computeManifestHash(manifest);
      setProgress({ stage: 'hashing', progress: 50, message: `Manifest hash: ${manifestHash.substring(0, 16)}...` });

      // Stage 3: Signing with wallet
      setProgress({ stage: 'signing', progress: 55, message: 'Requesting wallet signature...' });
      const signature = await walletManager.signMessage(manifestHash);
      setProgress({ stage: 'signing', progress: 65, message: 'Signature obtained successfully' });

      // Stage 4: Uploading to Walrus
      setProgress({ stage: 'uploading', progress: 70, message: 'Obtaining Walrus upload URL...' });
      const { uploadUrl } = await uploadApi.getUploadUrl();
      
      const startTime = Date.now();
      const walrusCID = await uploadApi.uploadToWalrus(uploadUrl, file, (p) => {
        const elapsed = (Date.now() - startTime) / 1000;
        const speed = (file.size * (p / 100)) / elapsed / 1024 / 1024; // MB/s
        const remaining = elapsed * (100 - p) / p;
        setProgress({ 
          stage: 'uploading', 
          progress: 70 + (p * 0.15), 
          message: `Uploading: ${p.toFixed(1)}% (${speed.toFixed(2)} MB/s, ${remaining.toFixed(0)}s remaining)` 
        });
      });
      
      setProgress({ stage: 'uploading', progress: 85, message: `Uploaded to Walrus: ${walrusCID}` });

      // Stage 5: Minting on Sui blockchain
      setProgress({ stage: 'minting', progress: 90, message: 'Creating transaction...' });
      const { adapterId, txHash } = await uploadApi.mintAdapter({
        name: formData.name,
        manifestHash,
        walrusCID,
        signature,
        manifest,
      });
      
      setProgress({ stage: 'minting', progress: 95, message: 'Transaction submitted to blockchain...' });

      // Stage 6: Complete
      setProgress({ stage: 'complete', progress: 100, message: 'Upload complete!' });
      setTxResult({ adapterId, txHash });

      toast({
        title: 'Adapter uploaded successfully!',
        description: `Your adapter has been minted on Sui`,
      });

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      setProgress(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {isNewVersion ? 'Upload New Version' : isFork ? 'Fork Adapter' : 'Upload'} <span className="gradient-text">Adapter</span>
            </h1>
            <p className="text-muted-foreground">
              {isNewVersion 
                ? 'Upload a new version of your adapter with improvements or fixes'
                : isFork
                ? 'Create your own version of this adapter'
                : 'Share your LoRA adapter with the community'}
            </p>
            {(isNewVersion || isFork) && (
              <Alert className="mt-4">
                <AlertDescription>
                  {isNewVersion 
                    ? `Creating a new version that will be linked to the original adapter`
                    : `Forking creates a new independent adapter based on the original`}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {!uploading && !txResult ? (
            <div className="space-y-6">
              <FileUpload onFileSelect={handleFileSelect} />

              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {validationErrors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {extractedManifest && (
                <Alert>
                  <AlertDescription>
                    <strong>Manifest detected:</strong> {extractedManifest.name} v{extractedManifest.version}
                  </AlertDescription>
                </Alert>
              )}

              <div className="glass-panel p-6 rounded-lg space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Adapter Name *</Label>
                    <Input
                      id="name"
                      placeholder="My Awesome Adapter"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="baseModel">Base Model *</Label>
                    <Input
                      id="baseModel"
                      placeholder="llama-2-7b"
                      value={formData.baseModel}
                      onChange={(e) => setFormData({ ...formData, baseModel: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task">Task *</Label>
                    <Input
                      id="task"
                      placeholder="text-generation"
                      value={formData.task}
                      onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license">License</Label>
                    <Input
                      id="license"
                      placeholder="MIT"
                      value={formData.license}
                      onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your adapter, its use cases, and any special considerations..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between glass-panel p-4 rounded-lg">
                    <div>
                      <Label htmlFor="private">Private/Premium Adapter</Label>
                      <p className="text-sm text-muted-foreground">
                        Requires purchase to download
                      </p>
                    </div>
                    <Switch
                      id="private"
                      checked={formData.isPrivate}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
                    />
                  </div>

                  {formData.isPrivate && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (SUI)</Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.1"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        />
                      </div>

                      <Alert>
                        <AlertDescription>
                          <div className="space-y-2">
                            <p className="font-semibold">🔒 Encrypted Adapter</p>
                            <p className="text-sm">
                              Private adapters are automatically encrypted before upload. After purchase:
                            </p>
                            <ul className="text-sm space-y-1 ml-4">
                              <li>• Buyer receives an on-chain purchase receipt (NFT)</li>
                              <li>• Decryption key is delivered via encrypted message</li>
                              <li>• Only verified purchasers can decrypt and use the adapter</li>
                              <li>• Your adapter files remain secure on Walrus</li>
                            </ul>
                          </div>
                        </AlertDescription>
                      </Alert>
                    </>
                  )}
                </div>
              </div>

              <Button
                onClick={handleUpload}
                disabled={!file || validationErrors.length > 0}
                className="w-full bg-gradient-primary"
                size="lg"
              >
                Upload Adapter
              </Button>
            </div>
          ) : txResult ? (
            <div className="glass-panel p-8 rounded-lg space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold gradient-text">Upload Complete!</h2>
                <p className="text-muted-foreground">
                  Your adapter has been successfully minted on the Sui blockchain
                </p>

                <div className="glass-panel p-4 rounded-lg text-left space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Adapter ID</Label>
                    <p className="font-mono text-sm mt-1 break-all">{txResult.adapterId}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Transaction Hash</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-mono text-sm break-all flex-1">{txResult.txHash}</p>
                      <a
                        href={`https://suiexplorer.com/txblock/${txResult.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 shrink-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => navigate(`/adapter/${txResult.adapterId}`)}
                    className="flex-1 bg-gradient-primary"
                  >
                    View Adapter
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="flex-1"
                  >
                    Upload Another
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-lg">
              {progress && <UploadProgress progress={progress} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
