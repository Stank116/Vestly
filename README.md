# Vestly Frontend

Milestone-based USDC escrow UI for Solana contributor payments.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What Works Now

- Phantom wallet connection through Solana wallet adapter
- Wallet-protected dashboard, contracts, payments, earnings, profile, and settings pages
- Landing page that explains the product before the wallet gate
- Explore page for public bounty discovery
- Client flow: create contract, add milestones, copy contributor link, approve milestones
- Contributor flow: open contract, submit milestone, view earnings
- Role-aware sidebar based on connected wallet
- Local browser persistence for demo contracts and milestone state
- Production build passes with `npm run build`

## Project Structure

```text
releasd/
  app/
    layout.tsx
    providers.tsx
    page.tsx
    dashboard/
    explore/
    contracts/
      [id]/
    create/
    payments/
    earnings/
    profile/
    settings/
  components/
    layout/
      Sidebar.tsx
      Topbar.tsx
    ui/
      ActivityFeed.tsx
      Avatar.tsx
      ContractRow.tsx
      Icon.tsx
      MilestoneItem.tsx
      PageLoader.tsx
      ProgressBar.tsx
      StatCard.tsx
      StatusBadge.tsx
      WalletGuard.tsx
  hooks/
    useContracts.ts
    useRole.ts
  lib/
    mockData.ts
    storage.ts
    utils.ts
  styles/
    globals.css
  types/
    index.ts
```

## Devnet Wiring Still Needed

The frontend is ready for Anchor, but the current create/submit/approve actions are demo-mode local actions. To make real USDC move on devnet, replace the local functions in `lib/storage.ts` with Anchor client calls after the program ID and IDL are available.
