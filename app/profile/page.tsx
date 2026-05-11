'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Topbar from '@/components/layout/Topbar';
import WalletGuard from '@/components/ui/WalletGuard';
import { useContracts } from '@/hooks/useContracts';

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const { contracts, wallet } = useContracts();

  const asClient = contracts.filter((contract) => contract.clientWallet === wallet);
  const asContributor = contracts.filter(
    (contract) => contract.contributorWallet === wallet
  );
  const totalEscrow = asClient.reduce((sum, contract) => sum + contract.usdc, 0);
  const totalEarned = asContributor.reduce(
    (sum, contract) => sum + contract.releasedUsdc,
    0
  );

  const info = [
    { label: 'Contracts as client', value: String(asClient.length) },
    { label: 'Contracts as contributor', value: String(asContributor.length) },
    { label: 'Total escrow funded', value: `$${totalEscrow.toLocaleString()} USDC` },
    { label: 'Total earned', value: `$${totalEarned.toLocaleString()} USDC` },
    { label: 'Network', value: 'Solana Devnet' },
    { label: 'Token standard', value: 'USDC (SPL)' },
  ];

  const short = publicKey
    ? `${publicKey.toString().slice(0, 4)}${publicKey.toString().slice(-2)}`
    : 'YO';

  return (
    <WalletGuard>
      <div className="screen-content">
        <Topbar title="Profile" />

        <div className="content-pad">
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
            <div className="profile-avatar">{short.toUpperCase()}</div>
            <div>
              <div className="profile-title">Connected wallet</div>
              <div className="profile-addr">{publicKey?.toString()}</div>
              <div style={{ marginTop: 8 }}>
                <span className="badge badge-active">Phantom connected</span>
              </div>
            </div>
          </div>

          <div className="info-grid" style={{ marginBottom: 24 }}>
            {info.map((item) => (
              <div key={item.label} className="info-card">
                <div className="info-label">{item.label}</div>
                <div className="info-value">{item.value}</div>
              </div>
            ))}
          </div>

          <WalletMultiButton className="wallet-adapter-button-trigger" />
        </div>
      </div>
    </WalletGuard>
  );
}
