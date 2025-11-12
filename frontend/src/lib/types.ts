// Core types for MindShard application

export interface Adapter {
  id: string;
  name: string;
  description: string;
  version: string;
  baseModel: string;
  task: string;
  language: string;
  license: string;
  creator: string;
  creatorAddress: string;
  manifestHash: string;
  walrusCID: string;
  signature: string;
  createdAt: string;
  updatedAt: string;
  downloads: number;
  purchases: number;
  verified: boolean;
  price?: number;
  isPrivate: boolean;
  tags: string[];
  parentId?: string;
  versions: AdapterVersion[];
}

export interface AdapterVersion {
  version: string;
  walrusCID: string;
  manifestHash: string;
  createdAt: string;
  changelog?: string;
}

export interface AdapterManifest {
  name: string;
  version: string;
  description: string;
  base_models: string[];
  task: string;
  language: string;
  license: string;
  authors: {
    name: string,
    sui_address: string
  }[],
  files: {
    adapter: string;
    config: string;
  };
  checksums: {
    adapter: string;
    config: string;
  };
  metadata?: Record<string, any>;
}

export interface UploadProgress {
  stage: 'preparing' | 'hashing' | 'signing' | 'uploading' | 'minting' | 'complete';
  progress: number;
  message: string;
}

export interface User {
  id: string;
  email?: string;
  suiAddress?: string;
  username: string;
  createdAt: string;
  adapters: string[];
  purchases: string[];
}

export interface Purchase {
  id: string;
  adapterId: string;
  buyer: string;
  price: number;
  txHash: string;
  timestamp: string;
  decryptionKey?: string;
}

export interface SearchFilters {
  query?: string;
  baseModel?: string;
  task?: string;
  language?: string;
  license?: string;
  tags?: string[];
  sortBy?: 'popular' | 'newest' | 'price';
  verified?: boolean;
}

export interface WalletState {
  connected: boolean;
  address?: string;
  addressDisplay?: string;
  balance?: number;
}
