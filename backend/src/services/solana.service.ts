import { Connection, PublicKey } from '@solana/web3.js';
import { env } from '../config/env';

export const connection = new Connection(env.SOLANA_RPC_URL, 'confirmed');

export async function getExplorerTxUrl(signature: string) {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

export async function accountExists(address: string) {
  const account = await connection.getAccountInfo(new PublicKey(address));
  return account !== null;
}
