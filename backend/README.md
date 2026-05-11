# Vestly Backend

Express + TypeScript API for Vestly off-chain data.

The backend is not the money layer. Anchor/Solana is the source of truth for escrow funds, milestone state, and payout releases. This backend stores cheap/off-chain product data such as profiles, descriptions, notifications, and searchable records.

## Run

```bash
npm install
copy .env.example .env
npm run dev
```

Health check:

```bash
curl http://localhost:4000/health
```

## API

```text
GET  /health
GET  /api/auth/nonce/:walletAddress
POST /api/auth/login
GET  /api/users/me
PATCH /api/users/me
GET  /api/contracts
POST /api/contracts
GET  /api/contracts/:id
POST /api/milestones/:id/submit
POST /api/milestones/:id/release
GET  /api/notifications
```

Protected routes expect:

```text
x-wallet-address: <connected wallet public key>
```

## Database

`prisma/schema.prisma` is ready for Supabase/Postgres.

```bash
npm run prisma:generate
npm run prisma:migrate
```

The API currently uses in-memory storage by default so it can run locally before Supabase is configured.
