'use client';

import { ComponentType, ReactNode, useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

const SolanaConnectionProvider = ConnectionProvider as unknown as ComponentType<{
  endpoint: string;
  children: ReactNode;
}>;

const SolanaWalletProvider = WalletProvider as unknown as ComponentType<{
  wallets: PhantomWalletAdapter[];
  autoConnect?: boolean;
  children: ReactNode;
}>;

const SolanaWalletModalProvider = WalletModalProvider as unknown as ComponentType<{
  children: ReactNode;
}>;

export default function Providers({ children }: { children: ReactNode }) {
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_RPC_URL ?? clusterApiUrl('devnet'),
    []
  );

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <SolanaConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <SolanaWalletModalProvider>{children}</SolanaWalletModalProvider>
      </SolanaWalletProvider>
    </SolanaConnectionProvider>
  );
}
