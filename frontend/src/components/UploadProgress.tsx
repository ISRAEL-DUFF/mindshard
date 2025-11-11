import { CheckCircle2, Loader2 } from 'lucide-react';
import { UploadProgress as UploadProgressType } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface UploadProgressProps {
  progress: UploadProgressType;
}

const stages = [
  { key: 'preparing', label: 'Preparing files' },
  { key: 'hashing', label: 'Computing hashes' },
  { key: 'signing', label: 'Signing manifest' },
  { key: 'uploading', label: 'Uploading to Walrus' },
  { key: 'minting', label: 'Minting on Sui' },
  { key: 'complete', label: 'Complete' },
];

export function UploadProgress({ progress }: UploadProgressProps) {
  const currentStageIndex = stages.findIndex(s => s.key === progress.stage);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{progress.message}</span>
          <span className="text-muted-foreground">{progress.progress}%</span>
        </div>
        <Progress value={progress.progress} className="h-2" />
      </div>

      <div className="space-y-3">
        {stages.map((stage, index) => {
          const isComplete = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isPending = index > currentStageIndex;

          return (
            <div
              key={stage.key}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-all duration-300',
                isCurrent && 'glass-panel',
                isComplete && 'opacity-75'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
                  isComplete && 'bg-primary text-primary-foreground',
                  isCurrent && 'bg-gradient-primary text-white animate-pulse',
                  isPending && 'bg-muted text-muted-foreground'
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : isCurrent ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'font-medium transition-colors',
                  isCurrent && 'gradient-text',
                  isPending && 'text-muted-foreground'
                )}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
