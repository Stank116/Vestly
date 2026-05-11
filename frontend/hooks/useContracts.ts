'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Contract, UserRole } from '@/types';
import { getContractsForWallet } from '@/lib/storage';

export function useContracts() {
  const { publicKey, connected } = useWallet();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  const wallet = publicKey?.toString() ?? null;

  const refresh = useCallback(() => {
    if (!connected || !wallet) {
      setContracts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setContracts(getContractsForWallet(wallet));
    setLoading(false);
  }, [connected, wallet]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const role = useMemo<UserRole>(() => {
    if (!wallet || contracts.length === 0) return 'new';

    const isClient = contracts.some((contract) => contract.clientWallet === wallet);
    const isContributor = contracts.some(
      (contract) => contract.contributorWallet === wallet
    );

    if (isClient && isContributor) return 'both';
    if (isClient) return 'client';
    if (isContributor) return 'contributor';
    return 'new';
  }, [contracts, wallet]);

  return { contracts, loading, refresh, role, wallet };
}

