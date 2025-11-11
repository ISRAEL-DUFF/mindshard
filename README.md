# MindShard — Decentralized Fine-Tuning Marketplace

> A decentralized platform for storing, verifying, and trading AI fine-tuning adapters (LoRA / model deltas), powered by **Walrus**, **Sui**, **Seal**, and **Nautilus**.

---

## Overview
**MindShard** provides a transparent, decentralized infrastructure for AI model fine-tuning:

- **Upload** fine-tuning adapters to **Walrus** (decentralized storage).
- **Register** provenance and attribution on **Sui**.
- **Encrypt** and control access via **Seal**.
- **Verify** authenticity and quality via **Nautilus**.

Together, these layers enable **verifiable, private, and programmable AI collaboration**.

---

## Core Features

| Feature | Description |
|----------|--------------|
| **Decentralized Storage** | Store adapters on **Walrus** and register metadata on **Sui** |
| **Provenance Tracking** | Transparent on-chain records with creator attribution |
| **Private Adapters (Seal)** | Encrypt models and release keys via programmable Seal policies |
| **Verification (Nautilus)** | Generate secure enclave attestations proving adapter integrity |
| **Marketplace** | List, sell, and buy adapters with on-chain royalty enforcement |

---

## Architecture

```
Frontend → Nest.js Backend → Walrus (Storage)
                               ↓
                           Sui Blockchain
                           ↓         ↓
                       Seal (Access)  Nautilus (Attestation)
```

---

## Tech Stack
- **Backend:** Nest.js (TypeScript)
- **Blockchain:** Sui (Move)
- **Storage:** Walrus
- **Encryption:** Seal
- **Verification:** Nautilus
- **Database:** In-memory (Postgres planned)

---

## Quick Start

```bash
npm install
cp .env.example .env
npm run start:dev
```

**Environment**
```
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
WALRUS_RELAY_URL=https://relay.walrus.example
SEAL_API_URL=https://api.seal.example
NAUTILUS_API_URL=https://api.nautilus.example
PORT=3000
```

---

## Hackathon Info
- **Track:** AI × Data (Walrus Haulout 2025)
- **Focus:** Verifiable AI fine-tuning provenance.
- **Team:** Israel Duff (@EaziDeFi)

---

## Vision
MindShard bridges **AI transparency** and **data privacy** — empowering creators to publish fine-tuning adapters that are **verifiable**, **encrypted**, and **market-ready**.
