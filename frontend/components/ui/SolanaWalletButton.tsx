'use client';

import { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function SolanaWalletButton({ className = '' }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const buttonClassName = `wallet-adapter-button-trigger ${className}`.trim();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className={buttonClassName} type="button" disabled>
        Select Wallet
      </button>
    );
  }

  return (
    <WalletMultiButton
      className={buttonClassName}
    />
  );
}
