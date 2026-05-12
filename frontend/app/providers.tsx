'use client';

import { ComponentType, ReactNode, useCallback, useMemo } from 'react';
import {
  Adapter,
  WalletError,
  WalletNotReadyError,
} from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

const SolanaConnectionProvider = ConnectionProvider as unknown as ComponentType<{
  endpoint: string;
  children: ReactNode;
}>;

const SolanaWalletProvider = WalletProvider as unknown as ComponentType<{
  wallets: Adapter[];
  autoConnect?: boolean;
  localStorageKey?: string;
  onError?: (error: WalletError, adapter?: Adapter) => void;
  children: ReactNode;
}>;

const SolanaWalletModalProvider = WalletModalProvider as unknown as ComponentType<{
  children: ReactNode;
}>;

export default function Providers({ children }: { children: ReactNode }) {
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl('devnet'),
    []
  );

  const wallets = useMemo<Adapter[]>(() => [], []);
  const handleWalletError = useCallback(
    (error: WalletError, adapter?: Adapter) => {
      if (error instanceof WalletNotReadyError && adapter?.url) {
        window.open(adapter.url, '_blank', 'noopener,noreferrer');
      }
    },
    []
  );

  return (
    <SolanaConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider
        wallets={wallets}
        autoConnect={false}
        localStorageKey="vestlySolanaWallet"
        onError={handleWalletError}
      >
        <SolanaWalletModalProvider>{children}</SolanaWalletModalProvider>
      </SolanaWalletProvider>
    </SolanaConnectionProvider>
  );
}
