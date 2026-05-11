# Vestly Anchor Program

This folder contains the Solana/Anchor escrow program for Vestly.

## What This Folder Does

The `program/` folder is the on-chain part of Vestly. Everything in the
frontend can be changed by a browser user, and everything in the backend can be
changed by your server, but the Anchor program is the trusted escrow rulebook
that Solana validators execute.

For Vestly, the program should answer one main question:

> Who is allowed to move the USDC locked for a contract, and when?

The current MVP answer is:

1. The client creates a contract PDA.
2. The program creates an escrow vault token account owned by that PDA.
3. The client adds milestones whose total equals the contract total.
4. The client funds the vault with devnet USDC.
5. The contributor submits a milestone.
6. The client releases that milestone amount from the vault to the contributor.

That is the core escrow contract.

## Instructions

- `initialize_contract` creates the contract PDA and its USDC escrow vault.
- `add_milestone` creates one milestone PDA under the contract.
- `fund_escrow` transfers USDC from the client token account into the vault.
- `submit_milestone` lets the contributor mark locked work as submitted.
- `release_payment` lets the client release a submitted milestone payment.

## Source Layout

```text
programs/vestly/src/
  lib.rs
  errors.rs
  events.rs
  instructions/
  state/
```

## Build

```bash
anchor build
```

Required local tools:

- Rust and Cargo
- Solana CLI
- Anchor CLI

The program cannot be compiled until those tools are installed and available on
PATH.

## Devnet Setup, Step By Step

Run these commands from this `program/` folder after installing Rust, Solana CLI,
and Anchor CLI.

1. Point Solana CLI at devnet:

```bash
solana config set --url https://api.devnet.solana.com
```

2. Create a local deploy wallet if you do not already have one:

```bash
solana-keygen new
```

3. Add free devnet SOL to pay deployment fees:

```bash
solana airdrop 2
```

4. Build the program:

```bash
anchor build
```

5. Get the generated program id:

```bash
solana address -k target/deploy/vestly-keypair.json
```

6. Replace the placeholder id in both files:

```text
programs/vestly/src/lib.rs
Anchor.toml
```

7. Build again after changing the id:

```bash
anchor build
```

8. Deploy to devnet:

```bash
anchor deploy --provider.cluster devnet
```

9. Copy the generated IDL into the frontend:

```bash
mkdir -p ../frontend/public/idl
cp target/idl/vestly.json ../frontend/public/idl/vestly.json
```

10. Put these values in `frontend/.env.local`:

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=<your deployed program id>
NEXT_PUBLIC_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
```

After changing `.env.local`, restart the frontend dev server.

## RPC URL And Devnet

The RPC URL is the frontend's connection to Solana. It is not your contract.
It is just the Solana server endpoint the app asks questions like:

- What is this wallet balance?
- Does this token account exist?
- Send this signed transaction to devnet.
- Confirm this transaction.

For development, use:

```bash
https://api.devnet.solana.com
```

Devnet is a fake-money Solana network. You deploy real programs there, but the
SOL and USDC-like test tokens have no real value. Use devnet until the whole app
flow works.

## Deploy To Devnet

```bash
anchor deploy --provider.cluster devnet
```

After deployment, copy the generated IDL into the frontend and wire the frontend actions to the deployed program.

Frontend expects the IDL here:

```text
frontend/public/idl/vestly.json
```

Then set:

```bash
NEXT_PUBLIC_PROGRAM_ID=<deployed program id>
```
