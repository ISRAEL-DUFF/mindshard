import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AdapterManifest } from '@/lib/types';
import { Download, Upload, FileCheck, AlertCircle, PackagePlus } from 'lucide-react';
import JSZip from 'jszip';

export default function BundleCreatorPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    version: '1.0.0',
    description: '',
    baseModel: '',
    task: '',
    language: 'en',
    license: 'MIT',
    author: '',
  });
  const [adapterFile, setAdapterFile] = useState<File | null>(null);
  const [configFile, setConfigFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAdapterFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.safetensors')) {
        toast({
          title: 'Invalid file type',
          description: 'Adapter file must be a .safetensors file',
          variant: 'destructive',
        });
        return;
      }
      setAdapterFile(file);
    }
  };

  const handleConfigFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.json')) {
        toast({
          title: 'Invalid file type',
          description: 'Config file must be a .json file',
          variant: 'destructive',
        });
        return;
      }
      setConfigFile(file);
    }
  };

  const generateAndDownloadZip = async () => {
    // Validation
    if (!formData.name || !formData.description || !formData.baseModel || !formData.task || !formData.author) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!adapterFile) {
      toast({
        title: 'Missing adapter file',
        description: 'Please upload the adapter model file (.safetensors)',
        variant: 'destructive',
      });
      return;
    }

    if (!configFile) {
      toast({
        title: 'Missing config file',
        description: 'Please upload the adapter config file (.json)',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Create manifest
      const manifest: AdapterManifest = {
        name: formData.name,
        version: formData.version,
        description: formData.description,
        base_models: [formData.baseModel],
        task: formData.task,
        language: formData.language,
        license: formData.license,
        authors: [{
            name: formData.author,
            sui_address: ''
        }],
        files: {
        adapter: 'adapter_model.safetensors',
        config: 'adapter_config.json',
        },
        checksums: {
        adapter: '', // Will be computed on upload
        config: '', // Will be computed on upload
        },
    };

      // Create zip file
      const zip = new JSZip();
      
      // Add manifest.json
      zip.file('manifest.json', JSON.stringify(manifest, null, 2));
      
      // Add adapter file
      zip.file('adapter_model.safetensors', adapterFile);
      
      // Add config file
      zip.file('adapter_config.json', configFile);

      // Generate zip blob
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      // Trigger download
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.name.replace(/\s+/g, '_')}_v${formData.version}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Bundle created successfully!',
        description: 'Your adapter bundle has been downloaded',
      });

    } catch (error) {
      console.error('Bundle generation failed:', error);
      toast({
        title: 'Bundle generation failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = formData.name && formData.description && formData.baseModel && 
                      formData.task && formData.author && adapterFile && configFile;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Create Adapter <span className="gradient-text">Bundle</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Build a compatible adapter bundle online without manual zip file creation
            </p>
          </div>

          <Alert>
            <PackagePlus className="h-4 w-4" />
            <AlertDescription>
              This tool creates a zip bundle containing your adapter files and automatically generated manifest.
              The bundle will be ready to upload to the platform.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {/* Manifest Information Form */}
            <Card className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Adapter Information</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                  This information will be used to generate the manifest.json file
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                  <Label htmlFor="version">Version *</Label>
                  <Input
                    id="version"
                    placeholder="1.0.0"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
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
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    placeholder="en"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
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

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    placeholder="Your name or wallet address"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
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
            </Card>

            {/* File Uploads */}
            <Card className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Adapter Files</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                  Upload the required adapter model and configuration files
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adapter-file">Adapter Model File (.safetensors) *</Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <Input
                      id="adapter-file"
                      type="file"
                      accept=".safetensors"
                      onChange={handleAdapterFileSelect}
                      className="flex-1"
                    />
                    {adapterFile && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileCheck className="h-4 w-4 text-primary" />
                        <span className="truncate max-w-[150px] sm:max-w-[200px]">{adapterFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="config-file">Adapter Config File (.json) *</Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <Input
                      id="config-file"
                      type="file"
                      accept=".json"
                      onChange={handleConfigFileSelect}
                      className="flex-1"
                    />
                    {configFile && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileCheck className="h-4 w-4 text-primary" />
                        <span className="truncate max-w-[150px] sm:max-w-[200px]">{configFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Required files:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>adapter_model.safetensors - Your trained LoRA adapter weights</li>
                    <li>adapter_config.json - Configuration for your adapter</li>
                    <li>manifest.json - Auto-generated from the form above</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={generateAndDownloadZip}
              disabled={!isFormValid || isGenerating}
              className="w-full bg-gradient-primary"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Upload className="mr-2 h-5 w-5 animate-spin" />
                  Generating Bundle...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Generate & Download Bundle
                </>
              )}
            </Button>

            {isFormValid && (
              <Alert>
                <AlertDescription className="text-center">
                  Once downloaded, you can upload this bundle using the{' '}
                  <a href="/upload" className="text-primary hover:underline font-semibold">
                    Upload Adapter
                  </a>{' '}
                  page
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
