'use client';

import { useEffect, useMemo, useState } from 'react';
import { WalletName } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';

const ALLOWED_WALLET_NAMES = ['Phantom', 'Solflare', 'Backpack'];

function shortAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export default function SolanaWalletButton({ className = '' }: { className?: string }) {
  const {
    wallets,
    wallet,
    publicKey,
    connected,
    connecting,
    select,
    connect,
    disconnect,
  } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [requestedWallet, setRequestedWallet] = useState<WalletName | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const preferredWallet = useMemo(() => {
    return (
      wallets.find((item) => item.adapter.name === 'Phantom') ??
      wallets.find((item) =>
        ALLOWED_WALLET_NAMES.some((name) => item.adapter.name.includes(name))
      ) ??
      null
    );
  }, [wallets]);

  const connectedWalletName = wallet?.adapter.name ?? '';
  const isAllowedWallet = ALLOWED_WALLET_NAMES.some((name) =>
    connectedWalletName.includes(name)
  );

  useEffect(() => {
    if (!requestedWallet || !wallet || connected || connecting) return;
    if (wallet.adapter.name !== requestedWallet) return;

    connect()
      .catch(() => undefined)
      .finally(() => setRequestedWallet(null));
  }, [connect, connected, connecting, requestedWallet, wallet]);

  const handleClick = async () => {
    if (connected && isAllowedWallet) {
      await disconnect();
      return;
    }

    if (connected && !isAllowedWallet) {
      await disconnect();
    }

    if (!preferredWallet) {
      window.open('https://phantom.app/download', '_blank', 'noopener,noreferrer');
      return;
    }

    select(preferredWallet.adapter.name);
    setRequestedWallet(preferredWallet.adapter.name);
  };

  const label = !mounted
    ? 'Select Wallet'
    : connected && isAllowedWallet && publicKey
      ? shortAddress(publicKey.toString())
      : connected && !isAllowedWallet
        ? 'Switch to Solana wallet'
        : connecting || requestedWallet
          ? 'Connecting...'
          : preferredWallet
            ? `Connect ${preferredWallet.adapter.name}`
            : 'Install Phantom';

  return (
    <button
      className={`wallet-adapter-button-trigger ${className}`.trim()}
      onClick={handleClick}
      type="button"
    >
      {label}
    </button>
  );
}
