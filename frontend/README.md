# Vestly Frontend

This folder contains the Next.js frontend for Vestly.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

## What works now

- Phantom wallet connection through Solana wallet adapter
- Wallet-protected dashboard, contracts, payments, earnings, profile, and settings pages
- Landing page, dashboard, contracts, explore bounties, payments, earnings, profile, and settings
- Client and contributor flows with local demo persistence

## Notes

The current frontend is still demo-mode: contract and milestone state are stored in browser `localStorage`.
To make this a real app, connect the frontend to the Anchor program in `../program` and/or a backend API in `../backend`.

For best editor performance after the repo split, run `npm install` inside this
folder so `frontend/node_modules` exists locally.
