MindShard Nest.js Backend (Scaffold)
===================================

This scaffold implements a clean architecture-style Nest.js project with module separation for:
- auth
- adapters
- marketplace
- walrus (storage)
- sui (on-chain interactions)

It's intentionally minimal to get you started in the hackathon. Key endpoints:
- POST /adapters        -> create adapter metadata (demo)
- GET  /adapters/:id    -> fetch adapter
- POST /marketplace/list
- POST /marketplace/purchase
- POST /auth/register, /auth/login

Quickstart:
  cp .env.example .env
  npm install
  npm run start:dev

Notes:
- Replace WalrusService.uploadFile with real Walrus SDK.
- Implement SuiService.mintAdapterMetadata with @mysten/sui.js.
- For production enable TypeORM entities and a real DB.
