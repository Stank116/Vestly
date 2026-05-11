'use client';

import { ComponentType, ReactNode, useCallback, useMemo } from 'react';
import {
  WalletError,
  WalletNotReadyError,
} from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

const SolanaConnectionProvider = ConnectionProvider as unknown as ComponentType<{
  endpoint: string;
  children: ReactNode;
}>;

const SolanaWalletProvider = WalletProvider as unknown as ComponentType<{
  wallets: PhantomWalletAdapter[];
  autoConnect?: boolean;
  localStorageKey?: string;
  onError?: (error: WalletError, adapter?: PhantomWalletAdapter) => void;
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

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  const handleWalletError = useCallback(
    (error: WalletError, adapter?: PhantomWalletAdapter) => {
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
