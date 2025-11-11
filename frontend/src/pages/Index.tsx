import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Zap, GitBranch, Search, Upload } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Decentralized LoRA Registry</span>
              </div>
            </div>

            <h1 className="text-6xl font-bold tracking-tight">
              Share & Discover
              <br />
              <span className="gradient-text">AI Model Adapters</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A decentralized marketplace for LoRA fine-tuning adapters. Powered by Sui blockchain
              and Walrus storage for verifiable, immutable AI model components.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link to="/search">
                <Button size="lg" className="bg-gradient-primary text-lg px-8">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Adapters
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Adapter
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text">1,234</div>
                <div className="text-sm text-muted-foreground mt-1">Adapters</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text">567</div>
                <div className="text-sm text-muted-foreground mt-1">Creators</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text">8,901</div>
                <div className="text-sm text-muted-foreground mt-1">Downloads</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why MindShard?</h2>
          <p className="text-xl text-muted-foreground">
            Built for the decentralized AI future
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-panel hover:shadow-glow transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Verified & Secure</h3>
              <p className="text-muted-foreground">
                Cryptographic verification ensures adapter authenticity and integrity
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel hover:shadow-glow transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Instant Access</h3>
              <p className="text-muted-foreground">
                Download and integrate adapters directly into your ML pipeline
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel hover:shadow-glow transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary/20 flex items-center justify-center">
                <GitBranch className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Version Control</h3>
              <p className="text-muted-foreground">
                Track adapter versions, fork existing work, and collaborate
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel hover:shadow-glow transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Earn Revenue</h3>
              <p className="text-muted-foreground">
                Monetize your adapters with automatic royalties and tips
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="glass-panel rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-10" />
          <div className="relative space-y-6">
            <h2 className="text-4xl font-bold">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the decentralized AI revolution. Upload your first adapter or explore
              the marketplace.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/upload">
                <Button size="lg" className="bg-gradient-primary">
                  Upload Adapter
                </Button>
              </Link>
              <Link to="/search">
                <Button size="lg" variant="outline">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
