import { Link } from 'react-router-dom';
import { Download, DollarSign, Shield, GitFork, ExternalLink } from 'lucide-react';
import { Adapter } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface AdapterCardProps {
  adapter: Adapter;
}

export function AdapterCard({ adapter }: AdapterCardProps) {
  return (
    <Card className="glass-panel hover:shadow-glow transition-all duration-300 group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link to={`/adapter/${adapter.id}`}>
              <h3 className="text-lg font-semibold group-hover:gradient-text transition-all">
                {adapter.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {adapter.description}
            </p>
          </div>
          {adapter.verified && (
            <Shield className="h-5 w-5 text-primary shrink-0 ml-2" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {adapter.baseModel}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {adapter.task}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {adapter.language}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            {adapter.downloads}
          </div>
          {adapter.price && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {adapter.price} SUI
            </div>
          )}
          {adapter.parentId && (
            <div className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              Fork
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          by <span className="text-foreground font-medium">{adapter.creator}</span>
          <span className="mx-2">•</span>
          v{adapter.version}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link to={`/adapter/${adapter.id}`} className="flex-1">
          <Button variant="outline" className="w-full" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </Link>
        {adapter.price ? (
          <Button size="sm" className="bg-gradient-primary">
            <DollarSign className="h-4 w-4 mr-1" />
            Buy
          </Button>
        ) : (
          <Button size="sm" variant="secondary">
            <Download className="h-4 w-4 mr-1" />
            Free
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
