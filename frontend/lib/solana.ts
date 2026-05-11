import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

export const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID
  ? new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID)
  : null;

export const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl('devnet'),
  'confirmed'
);

export const USDC_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_USDC_MINT ??
    '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
);
