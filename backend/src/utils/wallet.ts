import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';

export function createLoginMessage(walletAddress: string, nonce: string) {
  return `Sign in to Vestly\n\nWallet: ${walletAddress}\nNonce: ${nonce}\n\nThis does not trigger a transaction.`;
}

export function verifyWalletSignature(input: {
  walletAddress: string;
  message: string;
  signature: string;
}) {
  const publicKey = new PublicKey(input.walletAddress);
  const messageBytes = new TextEncoder().encode(input.message);
  const signatureBytes = bs58.decode(input.signature);

  return nacl.sign.detached.verify(
    messageBytes,
    signatureBytes,
    publicKey.toBytes()
  );
}
