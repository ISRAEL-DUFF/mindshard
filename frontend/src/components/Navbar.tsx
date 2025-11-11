import { Link } from 'react-router-dom';
import { Sparkles, Upload, User, Search, Shield } from 'lucide-react';
import { WalletButton } from './WalletButton';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="border-b border-border backdrop-blur-xl bg-background/95 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">MindShard</h1>
              <p className="text-xs text-muted-foreground">Decentralized LoRA Registry</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/search">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </Link>
            <Link to="/upload">
              <Button variant="ghost" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
            
            <div className="h-6 w-px bg-border" />
            
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
