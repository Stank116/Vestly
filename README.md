# Vestly

Milestone-based USDC escrow for Solana contributor payments.

## Structure

```text
Vestly/
  frontend/   Next.js app, wallet UI, local demo mode, backend mirror hooks
  program/    Anchor smart contract for Solana escrow
  backend/    Express API for profiles, descriptions, notifications, and search
```

## Current Status

- Frontend builds and runs.
- Backend builds and `/health` works.
- Anchor program source is present, but cannot be compiled on this machine until Rust, Solana CLI, and Anchor CLI are installed.
- Frontend still works without backend/program because it falls back to local demo mode.

## Run Locally

Frontend:

```bash
cd frontend
npm install
npm run dev
```

If `localhost:3000` keeps loading or Next says another dev server is already
running, stop the old process shown by Next:

```powershell
taskkill /PID <pid_from_next_output> /F
```

If development is slow inside OneDrive, use the webpack dev server:

```bash
npm run dev:webpack
```

The fastest option is to move the project outside OneDrive, for example
`C:\Projects\Vestly`.

Backend:

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Anchor program:

```bash
cd program
anchor build
anchor test
anchor deploy --provider.cluster devnet
```

## Environment

Frontend uses:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=your_deployed_program_id
NEXT_PUBLIC_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
```

Backend uses:

```bash
PORT=4000
FRONTEND_ORIGIN=http://localhost:3000
DATABASE_URL=your_supabase_postgres_url
SOLANA_RPC_URL=https://api.devnet.solana.com
RESEND_API_KEY=optional
```

## Build Order

1. Keep frontend demo mode working.
2. Install Rust, Solana CLI, and Anchor CLI.
3. Build and deploy `program/` to devnet.
4. Copy `program/target/idl/vestly.json` to `frontend/public/idl/vestly.json`.
5. Add `NEXT_PUBLIC_PROGRAM_ID` to frontend env.
6. Turn on backend by setting `NEXT_PUBLIC_BACKEND_URL`.
7. Deploy frontend to Vercel and backend to Railway/Render.

## What Is Wired Today

- Demo mode works without Anchor or backend.
- Backend mirroring is enabled when `NEXT_PUBLIC_BACKEND_URL` is set.
- Real devnet create, submit, and release calls are wired in the frontend.
- Real devnet mode starts only after `NEXT_PUBLIC_PROGRAM_ID` is set and
  `frontend/public/idl/vestly.json` exists.
- The client wallet must have devnet SOL for fees and devnet USDC for funding.

## Escrow Flow

The main Vestly contract lives in `program/`. The frontend is the user
interface, the backend is an optional data mirror, and the Anchor program is the
real payment rulebook.

The on-chain flow is:

1. Client creates a contract with a contributor wallet and total USDC amount.
2. Client adds one or more milestones.
3. Client funds the escrow vault with devnet USDC.
4. Contributor submits a milestone.
5. Client approves it and releases that milestone payment.
6. When all milestones are released, the contract is completed.

Use devnet first. The RPC URL for devnet is:

```bash
https://api.devnet.solana.com
```

Frontend env:

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=<your deployed program id>
NEXT_PUBLIC_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
```

See `program/README.md` for the detailed Anchor build and deploy steps.
