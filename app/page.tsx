'use client';

import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Icon from '@/components/ui/Icon';

export default function HomePage() {
  return (
    <main className="landing-shell">
      <nav className="landing-nav">
        <Link href="/" className="landing-brand">
          Vestly
          <span>Solana escrow</span>
        </Link>
        <div className="landing-actions">
          <Link href="/explore" className="btn btn-ghost btn-sm">
            Explore
          </Link>
          <WalletMultiButton className="wallet-adapter-button-trigger" />
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-copy-block">
          <div className="hero-badge">
            <Icon name="lock" size={13} />
            Milestone USDC escrow on Solana Devnet
          </div>
          <h1 className="landing-title">Contributor payments with proof before work starts.</h1>
          <p className="landing-copy">
            Vestly lets crypto teams create milestone contracts, lock USDC in
            escrow, review contributor submissions, and release payouts with a
            wallet signature.
          </p>
          <div className="landing-cta">
            <Link href="/dashboard" className="btn btn-primary">
              Launch app
            </Link>
            <Link href="/create" className="btn btn-ghost">
              Create contract
            </Link>
          </div>
        </div>

        <div className="landing-preview">
          <div className="preview-top">
            <div>
              <span>Smart contract audit</span>
              <small>4 milestones - 5,200 USDC</small>
            </div>
            <span className="badge badge-review">In review</span>
          </div>
          <div className="preview-lock">
            <Icon name="lock" size={15} />
            5,200 USDC locked for contributor wallet
          </div>
          {[
            ['Initial codebase review', '$1,000', 'Paid'],
            ['Vulnerability report', '$1,500', 'Paid'],
            ['Final audit report', '$2,000', 'Needs approval'],
            ['Post-fix verification', '$700', 'Pending'],
          ].map(([title, amount, status]) => (
            <div className="preview-row" key={title}>
              <div>
                <strong>{title}</strong>
                <small>{status}</small>
              </div>
              <span>{amount}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-band">
        {[
          ['Private contracts', 'Share a direct contract link with one contributor.'],
          ['Public bounties', 'Let contributors discover opportunities and apply.'],
          ['On-chain payouts', 'Anchor wiring turns approvals into USDC transfers.'],
        ].map(([title, copy]) => (
          <div className="landing-card" key={title}>
            <div className="landing-card-title">{title}</div>
            <p>{copy}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
