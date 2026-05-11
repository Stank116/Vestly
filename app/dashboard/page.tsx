'use client';

import Link from 'next/link';
import Topbar from '@/components/layout/Topbar';
import StatCard from '@/components/ui/StatCard';
import ContractRow from '@/components/ui/ContractRow';
import ActivityFeed from '@/components/ui/ActivityFeed';
import Icon from '@/components/ui/Icon';
import WalletGuard from '@/components/ui/WalletGuard';
import PageLoader from '@/components/ui/PageLoader';
import { ACTIVITY } from '@/lib/mockData';
import { useContracts } from '@/hooks/useContracts';

export default function DashboardPage() {
  const { contracts, loading, role, wallet } = useContracts();

  if (loading) return <PageLoader />;

  const contributorMode = role === 'contributor';
  const visibleContracts = contributorMode
    ? contracts.filter((contract) => contract.contributorWallet === wallet)
    : contracts.filter((contract) => contract.clientWallet === wallet);

  const totalEscrowed = visibleContracts.reduce((sum, contract) => sum + contract.usdc, 0);
  const totalReleased = visibleContracts.reduce(
    (sum, contract) => sum + contract.releasedUsdc,
    0
  );
  const awaitingApproval = visibleContracts.filter(
    (contract) => contract.status === 'review'
  ).length;

  return (
    <WalletGuard>
      <div className="screen-content">
        <Topbar
          title={contributorMode ? 'My work' : 'Dashboard'}
          right={
            contributorMode ? (
              <button className="btn btn-ghost">
                <Icon name="bell" size={14} />
                Alerts
              </button>
            ) : (
              <>
                <button className="btn btn-ghost">
                  <Icon name="bell" size={14} />
                  Alerts
                </button>
                <Link href="/create" className="btn btn-primary">
                  <Icon name="plus" size={14} />
                  New contract
                </Link>
              </>
            )
          }
        />

        <div className="content-pad">
          <div className="stats-row" style={{ marginBottom: 28 }}>
            <StatCard
              label={contributorMode ? 'Total earned' : 'Total escrowed'}
              value={`$${(contributorMode ? totalReleased : totalEscrowed).toLocaleString()}`}
              sub={contributorMode ? 'USDC received' : 'USDC locked on-chain'}
              valueColor={contributorMode ? 'var(--green)' : 'var(--purple-l)'}
            />
            <StatCard
              label="Active contracts"
              value={String(visibleContracts.length)}
              sub={contributorMode ? 'Assigned to your wallet' : 'Created by your wallet'}
            />
            <StatCard
              label={contributorMode ? 'Awaiting review' : 'Awaiting approval'}
              value={String(awaitingApproval)}
              sub={contributorMode ? 'Submitted work' : 'Needs your signature'}
              subColor="var(--amber)"
            />
          </div>

          {visibleContracts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-title">
                {contributorMode ? 'No assigned work yet' : 'No contracts yet'}
              </div>
              <div className="empty-copy">
                {contributorMode
                  ? 'Ask a client to create a contract with your wallet address.'
                  : 'Create your first escrow contract to test the full frontend flow.'}
              </div>
              {!contributorMode && (
                <Link href="/create" className="btn btn-primary">
                  <Icon name="plus" size={14} />
                  Create first contract
                </Link>
              )}
            </div>
          ) : (
            <div className="dashboard-grid">
              <div className="content-surface" style={{ padding: '18px' }}>
                <div className="section-head">
                  <div className="section-title">
                    {contributorMode ? 'Assigned contracts' : 'Active contracts'}
                  </div>
                  <Link
                    href="/contracts"
                    className="link-btn"
                    style={{
                      textDecoration: 'none',
                      fontSize: 12,
                      color: 'var(--text3)',
                    }}
                  >
                    View all
                  </Link>
                </div>
                {visibleContracts.map((contract) => (
                  <ContractRow key={contract.id} contract={contract} />
                ))}
              </div>

              <div className="content-surface" style={{ padding: '18px' }}>
                <div className="section-head">
                  <div className="section-title">Recent activity</div>
                </div>
                <ActivityFeed items={ACTIVITY} />
              </div>
            </div>
          )}
        </div>
      </div>
    </WalletGuard>
  );
}
