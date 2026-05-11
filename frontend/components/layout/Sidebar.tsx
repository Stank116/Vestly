'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Icon from '@/components/ui/Icon';
import { useContracts } from '@/hooks/useContracts';

const CLIENT_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard', section: 'Overview' },
  { href: '/contracts', label: 'My contracts', icon: 'file', section: '' },
  { href: '/explore', label: 'Explore bounties', icon: 'search', section: '' },
  { href: '/payments', label: 'Payment log', icon: 'receipt', section: '' },
  { href: '/create', label: 'New contract', icon: 'plus', section: 'Workspace' },
  { href: '/profile', label: 'Profile', icon: 'user', section: 'Account' },
  { href: '/settings', label: 'Settings', icon: 'settings', section: '' },
];

const CONTRIBUTOR_NAV = [
  { href: '/dashboard', label: 'My work', icon: 'dashboard', section: 'Overview' },
  { href: '/explore', label: 'Explore bounties', icon: 'search', section: '' },
  { href: '/contracts', label: 'My contracts', icon: 'file', section: '' },
  { href: '/earnings', label: 'Earnings', icon: 'coin', section: '' },
  { href: '/profile', label: 'Profile + rep', icon: 'user', section: 'Account' },
  { href: '/settings', label: 'Settings', icon: 'settings', section: '' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { publicKey, connected, wallet: connectedWallet } = useWallet();
  const { role } = useContracts();

  const isContributorOnly = role === 'contributor';
  const nav = isContributorOnly ? CONTRIBUTOR_NAV : CLIENT_NAV;
  const shortAddress = publicKey
    ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
    : null;
  const walletName = connectedWallet?.adapter.name ?? 'Wallet';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <div className="logo-text">Vestly</div>
          <div className="logo-tag">
            {isContributorOnly ? 'Contributor workspace' : 'Solana escrow - Devnet'}
          </div>
        </Link>
      </div>

      <nav style={{ flex: 1, paddingTop: 8 }}>
        {nav.map((item) => (
          <div key={item.href}>
            {item.section && <div className="nav-section-label">{item.section}</div>}
            <Link
              href={item.href}
              className={`nav-item ${
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? 'active'
                  : ''
              }`}
            >
              <Icon name={item.icon} size={15} />
              {item.label}
            </Link>
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {connected && publicKey ? (
          <div className="wallet-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                {isContributorOnly ? 'Contributor' : 'Client'} - {walletName}
              </span>
            </div>
            <div className="wallet-addr">{shortAddress}</div>
          </div>
        ) : (
          <WalletMultiButton className="wallet-adapter-button-trigger" />
        )}
      </div>
    </aside>
  );
}
