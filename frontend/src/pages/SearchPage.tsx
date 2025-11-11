import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AdapterCard } from '@/components/AdapterCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Adapter } from '@/lib/types';

// Mock data - TODO: Replace with actual API calls
const mockAdapters: Adapter[] = [
  {
    id: '1',
    name: 'GPT-4 Style Adapter',
    description: 'Fine-tuned adapter for GPT-like writing style with improved coherence',
    version: '1.0.0',
    baseModel: 'llama-2-7b',
    task: 'text-generation',
    language: 'en',
    license: 'MIT',
    creator: 'alice.sui',
    creatorAddress: '0x123...',
    manifestHash: '0xabc...',
    walrusCID: 'walrus://xyz',
    signature: '0xsig...',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    downloads: 1234,
    purchases: 45,
    verified: true,
    price: 10,
    isPrivate: false,
    tags: ['writing', 'creative', 'text'],
    versions: [],
  },
  {
    id: '2',
    name: 'Code Completion Pro',
    description: 'Specialized adapter for code generation and completion tasks',
    version: '2.1.0',
    baseModel: 'codellama-13b',
    task: 'code-generation',
    language: 'multi',
    license: 'Apache-2.0',
    creator: 'bob.dev',
    creatorAddress: '0x456...',
    manifestHash: '0xdef...',
    walrusCID: 'walrus://abc',
    signature: '0xsig2...',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-10',
    downloads: 2456,
    purchases: 89,
    verified: true,
    price: 25,
    isPrivate: false,
    tags: ['code', 'programming'],
    versions: [],
  },
  {
    id: '3',
    name: 'Image Caption Master',
    description: 'High-quality image captioning and description generation',
    version: '1.5.0',
    baseModel: 'llava-7b',
    task: 'image-to-text',
    language: 'en',
    license: 'MIT',
    creator: 'carol.vision',
    creatorAddress: '0x789...',
    manifestHash: '0xghi...',
    walrusCID: 'walrus://def',
    signature: '0xsig3...',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-25',
    downloads: 567,
    purchases: 23,
    verified: true,
    price: 0,
    isPrivate: false,
    tags: ['image', 'vision', 'captioning'],
    versions: [],
  },
  {
    id: '4',
    name: 'Premium Writing Assistant',
    description: 'Professional writing enhancement with style transfer capabilities',
    version: '3.0.0',
    baseModel: 'llama-2-13b',
    task: 'text-generation',
    language: 'en',
    license: 'Commercial',
    creator: 'alice.sui',
    creatorAddress: '0x123...',
    manifestHash: '0xjkl...',
    walrusCID: 'walrus://ghi',
    signature: '0xsig4...',
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15',
    downloads: 89,
    purchases: 12,
    verified: false,
    price: 50,
    isPrivate: false,
    tags: ['writing', 'premium', 'text'],
    versions: [],
  },
  {
    id: '5',
    name: 'Free Sentiment Analyzer',
    description: 'Open-source sentiment analysis adapter for text classification',
    version: '1.0.0',
    baseModel: 'bert-base',
    task: 'text-classification',
    language: 'en',
    license: 'MIT',
    creator: 'dave.ml',
    creatorAddress: '0xabc...',
    manifestHash: '0xmno...',
    walrusCID: 'walrus://jkl',
    signature: '0xsig5...',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
    downloads: 3421,
    purchases: 0,
    verified: true,
    price: 0,
    isPrivate: false,
    tags: ['text', 'classification', 'free'],
    versions: [],
  },
  {
    id: '6',
    name: 'Image Generation LoRA',
    description: 'Fine-tuned adapter for stable diffusion image generation',
    version: '2.0.0',
    baseModel: 'stable-diffusion-xl',
    task: 'text-to-image',
    language: 'en',
    license: 'CreativeML',
    creator: 'eve.artist',
    creatorAddress: '0xdef...',
    manifestHash: '0xpqr...',
    walrusCID: 'walrus://mno',
    signature: '0xsig6...',
    createdAt: '2024-02-20',
    updatedAt: '2024-02-22',
    downloads: 1876,
    purchases: 156,
    verified: true,
    price: 15,
    isPrivate: false,
    tags: ['image', 'generation', 'art'],
    versions: [],
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');

  // Filter and sort adapters
  const filteredAdapters = useMemo(() => {
    let filtered = [...mockAdapters];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(adapter =>
        adapter.name.toLowerCase().includes(query) ||
        adapter.creator.toLowerCase().includes(query) ||
        adapter.baseModel.toLowerCase().includes(query) ||
        adapter.description.toLowerCase().includes(query)
      );
    }

    // Tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(adapter => {
        return selectedTags.every(tag => {
          switch (tag.toLowerCase()) {
            case 'verified':
              return adapter.verified;
            case 'free':
              return !adapter.price || adapter.price === 0;
            case 'premium':
              return adapter.price && adapter.price > 0;
            case 'text':
              return adapter.task.includes('text') || adapter.tags.includes('text');
            case 'image':
              return adapter.task.includes('image') || adapter.tags.includes('image');
            case 'code':
              return adapter.task.includes('code') || adapter.tags.includes('code');
            default:
              return true;
          }
        });
      });
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.downloads + b.purchases * 10) - (a.downloads + a.purchases * 10));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
    }

    return filtered;
  }, [searchQuery, selectedTags, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Discover <span className="gradient-text">Adapters</span>
            </h1>
            <p className="text-muted-foreground">
              Browse and search through thousands of verified LoRA adapters
            </p>
          </div>

          {/* Search and Filters */}
          <div className="glass-panel p-6 rounded-lg space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search adapters by name, creator, or base model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex-1 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Quick filters:</span>
                {['Verified', 'Free', 'Premium', 'Text', 'Image', 'Code'].map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                      );
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <div className="text-sm text-muted-foreground mb-4">
              Found {filteredAdapters.length} adapter{filteredAdapters.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
            {filteredAdapters.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAdapters.map(adapter => (
                  <AdapterCard key={adapter.id} adapter={adapter} />
                ))}
              </div>
            ) : (
              <div className="glass-panel p-12 rounded-lg text-center">
                <p className="text-muted-foreground">
                  No adapters found matching your criteria. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
