import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from './FileUpload';
import { Upload } from 'lucide-react';

interface NewVersionModalProps {
  open: boolean;
  onClose: () => void;
  adapterId: string;
  adapterName: string;
  currentVersion: string;
}

export function NewVersionModal({ 
  open, 
  onClose, 
  adapterId, 
  adapterName,
  currentVersion 
}: NewVersionModalProps) {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [changelog, setChangelog] = useState('');

  const handleSubmit = () => {
    if (!file) return;
    
    // Navigate to upload page with parent adapter context
    navigate('/upload', { 
      state: { 
        parentId: adapterId,
        isNewVersion: true,
        parentName: adapterName,
        currentVersion,
        changelog,
        file
      } 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload New Version</DialogTitle>
          <DialogDescription>
            Upload a new version of {adapterName} (current: v{currentVersion})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Adapter Bundle</Label>
            <FileUpload onFileSelect={setFile} accept=".zip" maxSize={100} />
          </div>

          <div>
            <Label htmlFor="changelog">Changelog (Optional)</Label>
            <Textarea
              id="changelog"
              placeholder="What's new in this version?"
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!file}
              className="bg-gradient-primary"
            >
              <Upload className="h-4 w-4 mr-2" />
              Continue to Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
