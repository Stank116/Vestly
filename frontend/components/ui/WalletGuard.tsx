'use client';

import { ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Icon from './Icon';
import SolanaWalletButton from './SolanaWalletButton';

export default function WalletGuard({ children }: { children: ReactNode }) {
  const { connected, connecting } = useWallet();

  if (connected) return <>{children}</>;

  return (
    <div className="wallet-guard">
      <div className="wallet-guard-card">
        <div className="wallet-guard-icon">
          <Icon name="solana" size={24} />
        </div>
        <div className="wallet-guard-title">
          {connecting ? 'Connecting wallet' : 'Connect wallet to continue'}
        </div>
        <div className="wallet-guard-copy">
          Vestly uses your Solana wallet as your account. Use a Solana wallet
          on Devnet.
        </div>
        <SolanaWalletButton />
      </div>
    </div>
  );
}
