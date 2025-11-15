import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AdapterCard } from '@/components/AdapterCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Adapter } from '@/lib/types';
import { adapterApi } from '@/lib/api';


export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [adapters, setAdapters] = useState<Adapter[]>([]);
  const [loading, setLoading] = useState(false);

  // Map selectedTags to backend filters (only those that are not handled by backend are filtered client-side)
  const backendFilters = useMemo(() => {
    let filters: any = { query: searchQuery, sortBy };
    // Only pass baseModel and task if a single tag is selected and it matches a known filter
    selectedTags.forEach(tag => {
      switch (tag.toLowerCase()) {
        case 'text':
          filters.task = 'text-generation';
          break;
        case 'image':
          filters.task = 'image-to-text'; // or 'text-to-image' depending on your backend
          break;
        case 'code':
          filters.task = 'code-generation';
          break;
        // 'verified', 'free', 'premium' are handled client-side below
      }
    });
    return filters;
  }, [searchQuery, sortBy, selectedTags]);

  useEffect(() => {
    setLoading(true);
    adapterApi.search(backendFilters)
      .then(setAdapters)
      .finally(() => setLoading(false));
  }, [backendFilters]);

  // Client-side filter for tags not handled by backend
  const filteredAdapters = useMemo(() => {
    let filtered = [...adapters];
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
              return adapter.task?.includes('text') || adapter.tags?.includes('text');
            case 'image':
              return adapter.task?.includes('image') || adapter.tags?.includes('image');
            case 'code':
              return adapter.task?.includes('code') || adapter.tags?.includes('code');
            default:
              return true;
          }
        });
      });
    }
    return filtered;
  }, [adapters, selectedTags]);

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
