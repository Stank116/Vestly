'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Topbar from '@/components/layout/Topbar';
import SolanaWalletButton from '@/components/ui/SolanaWalletButton';
import WalletGuard from '@/components/ui/WalletGuard';
import { useContracts } from '@/hooks/useContracts';
import { getProfile, UserProfile } from '@/lib/profile';

export default function ProfilePage() {
  const { publicKey, wallet: connectedWallet } = useWallet();
  const { contracts, wallet } = useContracts();
  const walletName = connectedWallet?.adapter.name ?? 'Wallet';
  const [profile, setProfile] = useState<UserProfile>(() => getProfile(null));

  useEffect(() => {
    setProfile(getProfile(wallet));
  }, [wallet]);

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
    { label: 'Notification email', value: profile.email || 'Not set' },
    { label: 'Approval threshold', value: profile.approvalThreshold },
    { label: 'Network', value: 'Solana Devnet' },
    { label: 'Token standard', value: 'USDC (SPL)' },
  ];

  const displayName = profile.displayName.trim();
  const short = publicKey
    ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
    : 'Not connected';
  const avatarText = publicKey
    ? displayName
      ? displayName
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
      : `${publicKey.toString().slice(0, 2)}${publicKey.toString().slice(-2)}`
    : 'VE';

  return (
    <WalletGuard>
      <div className="screen-content">
        <Topbar title="Profile" />

        <div className="content-pad">
          <div className="profile-hero-card">
            <div className="profile-avatar">{avatarText.toUpperCase()}</div>
            <div className="profile-main">
              <div className="profile-kicker">Wallet profile</div>
              <div className="profile-title">{displayName || short}</div>
              <div className="profile-addr">{publicKey?.toString()}</div>
              <div className="profile-badge-row">
                <span className="badge badge-active">{walletName} connected</span>
                <span className="pill-muted">{profile.network}</span>
              </div>
            </div>
            <div className="profile-wallet-action">
              <SolanaWalletButton />
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

        </div>
      </div>
    </WalletGuard>
  );
}
