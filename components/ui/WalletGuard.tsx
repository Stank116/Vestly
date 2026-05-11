'use client';

import { ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Icon from './Icon';

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
          {connecting ? 'Connecting wallet' : 'Connect Phantom to continue'}
        </div>
        <div className="wallet-guard-copy">
          Vestly uses your Solana wallet as your account. Switch Phantom to
          Devnet for the hackathon demo.
        </div>
        <WalletMultiButton className="wallet-adapter-button-trigger" />
      </div>
    </div>
  );
}
