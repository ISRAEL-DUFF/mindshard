import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface VersionDiffProps {
  oldVersion: any;
  newVersion: any;
}

export function VersionDiff({ oldVersion, newVersion }: VersionDiffProps) {
  const fields = [
    { key: 'version', label: 'Version' },
    { key: 'baseModel', label: 'Base Model' },
    { key: 'task', label: 'Task' },
    { key: 'license', label: 'License' },
    { key: 'manifestHash', label: 'Manifest Hash' },
    { key: 'walrusCID', label: 'Walrus CID' },
  ];

  const getChangeType = (key: string) => {
    const oldVal = oldVersion[key];
    const newVal = newVersion[key];
    if (oldVal === newVal) return 'unchanged';
    if (!oldVal && newVal) return 'added';
    if (oldVal && !newVal) return 'removed';
    return 'modified';
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Version Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline">v{oldVersion.version}</Badge>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <Badge variant="default">v{newVersion.version}</Badge>
        </div>

        <div className="space-y-3">
          {fields.map(({ key, label }) => {
            const changeType = getChangeType(key);
            const oldVal = oldVersion[key];
            const newVal = newVersion[key];

            if (changeType === 'unchanged') {
              return (
                <div key={key} className="glass-panel p-3 rounded-lg opacity-60">
                  <div className="text-xs text-muted-foreground mb-1">{label}</div>
                  <div className="text-sm font-mono">{oldVal}</div>
                </div>
              );
            }

            return (
              <div key={key} className="glass-panel p-3 rounded-lg border-l-4 border-primary">
                <div className="text-xs text-muted-foreground mb-2">{label}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="bg-destructive/10 p-2 rounded">
                    <div className="text-xs text-destructive mb-1">Old</div>
                    <div className="text-sm font-mono break-all">
                      {typeof oldVal === 'string' && oldVal.length > 30 
                        ? `${oldVal.substring(0, 30)}...` 
                        : oldVal || '-'}
                    </div>
                  </div>
                  <div className="bg-primary/10 p-2 rounded">
                    <div className="text-xs text-primary mb-1">New</div>
                    <div className="text-sm font-mono break-all">
                      {typeof newVal === 'string' && newVal.length > 30 
                        ? `${newVal.substring(0, 30)}...` 
                        : newVal || '-'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
