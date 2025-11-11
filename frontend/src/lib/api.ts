// API client for MindShard backend
// TODO: Replace mock data with actual backend calls

import { Adapter, AdapterManifest, Purchase, SearchFilters, User } from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    // TODO: Implement actual API call
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  async register(email: string, password: string, username: string): Promise<{ token: string; user: User }> {
    // TODO: Implement actual API call
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  async me(token: string): Promise<User> {
    // TODO: Implement actual API call
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },
};

// Upload API
export const uploadApi = {
  async getUploadUrl(): Promise<{ uploadUrl: string; adapterId: string }> {
    // TODO: Implement actual API call to get Walrus pre-signed URL
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to get upload URL');
    return response.json();
  },

  async uploadToWalrus(uploadUrl: string, file: File, onProgress?: (progress: number) => void): Promise<string> {
    // TODO: Implement Walrus upload with progress tracking
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress?.(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve('mock-walrus-cid-' + Date.now());
        }
      }, 200);
    });
  },

  async mintAdapter(data: {
    name: string;
    manifestHash: string;
    walrusCID: string;
    signature: string;
    manifest: AdapterManifest;
  }): Promise<{ adapterId: string; txHash: string }> {
    // TODO: Implement Sui transaction for minting
    const response = await fetch(`${API_BASE}/mint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to mint adapter');
    return response.json();
  },
};

// Adapter API
export const adapterApi = {
  async search(filters: SearchFilters): Promise<Adapter[]> {
    // TODO: Implement actual search with filters
    const params = new URLSearchParams();
    if (filters.query) params.append('q', filters.query);
    if (filters.baseModel) params.append('baseModel', filters.baseModel);
    if (filters.task) params.append('task', filters.task);
    if (filters.sortBy) params.append('sort', filters.sortBy);
    
    const response = await fetch(`${API_BASE}/adapters?${params}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  },

  async getById(id: string): Promise<Adapter> {
    // TODO: Implement actual API call
    const response = await fetch(`${API_BASE}/adapter/${id}`);
    if (!response.ok) throw new Error('Failed to fetch adapter');
    return response.json();
  },

  async verify(id: string): Promise<{ verified: boolean; details: any }> {
    // TODO: Implement server-side verification
    const response = await fetch(`${API_BASE}/verify/${id}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Verification failed');
    return response.json();
  },

  async download(id: string): Promise<Blob> {
    // TODO: Implement download from Walrus
    const response = await fetch(`${API_BASE}/adapter/${id}/download`);
    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  },
};

// Marketplace API
export const marketplaceApi = {
  async purchase(adapterId: string, price: number): Promise<Purchase> {
    // TODO: Implement Sui transaction for purchase
    const response = await fetch(`${API_BASE}/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adapterId, price }),
    });
    if (!response.ok) throw new Error('Purchase failed');
    return response.json();
  },

  async listForSale(adapterId: string, price: number, royalty: number): Promise<void> {
    // TODO: Implement listing logic
    const response = await fetch(`${API_BASE}/adapter/${adapterId}/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price, royalty }),
    });
    if (!response.ok) throw new Error('Failed to list adapter');
  },

  async tip(adapterId: string, amount: number): Promise<{ txHash: string }> {
    // TODO: Implement tipping via Sui
    const response = await fetch(`${API_BASE}/adapter/${adapterId}/tip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) throw new Error('Tip failed');
    return response.json();
  },
};
