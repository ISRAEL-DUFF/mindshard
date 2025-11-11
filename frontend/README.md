# MindShard - Decentralized LoRA Adapter Registry & Marketplace

A decentralized marketplace for LoRA fine-tuning adapters built on Sui blockchain with Walrus storage.

## Features

- **Sui Wallet Integration**: Connect your Sui wallet to upload, purchase, and verify adapters
- **Upload Adapters**: Drag-and-drop upload with automatic hashing and signature verification
- **Marketplace**: Buy, sell, and tip creators with automatic royalty distribution
- **Verification**: Cryptographic verification of adapter authenticity and integrity
- **Version Control**: Track adapter versions, fork existing work, and manage updates
- **Private Adapters**: Encrypted premium adapters with purchase-gated access
- **Creator Dashboard**: Analytics, earnings tracking, and adapter management
- **Admin Panel**: Content moderation and platform integrity tools

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui with Radix primitives
- **Blockchain**: Sui (TODO: Install @mysten/sui.js)
- **Storage**: Walrus decentralized blob storage
- **State Management**: TanStack Query
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Sui wallet browser extension (for wallet features)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SUI_NETWORK=devnet
VITE_WALRUS_ENDPOINT=https://walrus-devnet.example.com
```

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── Navbar.tsx
│   ├── WalletButton.tsx
│   ├── AdapterCard.tsx
│   ├── FileUpload.tsx
│   └── UploadProgress.tsx
├── pages/             # Route pages
│   ├── Index.tsx
│   ├── SearchPage.tsx
│   ├── UploadPage.tsx
│   ├── AdapterDetailPage.tsx
│   ├── DashboardPage.tsx
│   ├── AdminPage.tsx
│   └── AuthPage.tsx
├── lib/               # Utilities and services
│   ├── types.ts       # TypeScript definitions
│   ├── api.ts         # API client
│   ├── wallet.ts      # Sui wallet integration
│   └── crypto.ts      # Cryptographic utilities
└── App.tsx            # Root component with routing
```

## Backend Integration

This frontend requires a Nest.js backend with the following endpoints:

### Authentication
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/register` - Create new account
- `GET /api/auth/me` - Get current user

### Upload & Minting
- `POST /api/upload` - Get Walrus upload URL
- `POST /api/mint` - Mint adapter metadata on Sui

### Adapters
- `GET /api/adapters?q=...` - Search adapters
- `GET /api/adapter/:id` - Get adapter details
- `GET /api/adapter/:id/download` - Download adapter
- `POST /api/verify/:id` - Verify adapter

### Marketplace
- `POST /api/purchase` - Purchase adapter
- `POST /api/adapter/:id/list` - List for sale
- `POST /api/adapter/:id/tip` - Send tip

## Development Notes

### TODO: Backend Integration

The following features require backend implementation:

1. **Walrus Upload**: Actual pre-signed URL generation and upload to Walrus
2. **Sui Transactions**: Real blockchain transactions for minting, purchasing, and tipping
3. **Signature Verification**: Server-side Ed25519 signature verification
4. **Database**: Adapter metadata storage and indexing
5. **Search**: Full-text search with filters
6. **Analytics**: Download/purchase tracking
7. **Encryption**: AES-GCM for private adapters

### TODO: Wallet Integration

Install Sui wallet packages:

```bash
npm install @mysten/sui.js @mysten/wallet-adapter-react
```

Then update `src/lib/wallet.ts` with actual Sui wallet integration.

### Design System

The app uses a violet-cyan gradient theme with:
- Primary: `hsl(262 83% 68%)` (violet)
- Secondary: `hsl(189 94% 43%)` (cyan)
- Dark background with glassmorphic panels
- Custom gradients and glow effects

All design tokens are in `src/index.css` and `tailwind.config.ts`.

## Testing

```bash
# Run unit tests (TODO: Add tests)
npm test

# Run e2e tests (TODO: Add tests)
npm run test:e2e
```

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
