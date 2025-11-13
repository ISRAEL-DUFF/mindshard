import { Link } from 'react-router-dom';
import { Sparkles, Upload, User, Search, Shield, PackagePlus, Menu } from 'lucide-react';
import { WalletButton } from './WalletButton';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/create-bundle', icon: PackagePlus, label: 'Create Bundle' },
    { to: '/upload', icon: Upload, label: 'Upload' },
    { to: '/dashboard', icon: User, label: 'Dashboard' },
    { to: '/admin', icon: Shield, label: 'Admin' },
  ];

  return (
    <nav className="border-b border-border backdrop-blur-xl bg-background/95 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold gradient-text">MindShard</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Decentralized LoRA Registry</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to}>
                <Button variant="ghost" size="sm">
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              </Link>
            ))}
            
            <div className="h-6 w-px bg-border" />
            
            <WalletButton />
          </div>

          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center gap-2">
            <WalletButton />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map(({ to, icon: Icon, label }) => (
                    <Link 
                      key={to} 
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full justify-start" size="lg">
                        <Icon className="h-5 w-5 mr-3" />
                        {label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
