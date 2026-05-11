import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL,
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com',
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};
