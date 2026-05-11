'use client';

import Link from 'next/link';
import Topbar from '@/components/layout/Topbar';
import ContractRow from '@/components/ui/ContractRow';
import Icon from '@/components/ui/Icon';
import WalletGuard from '@/components/ui/WalletGuard';
import PageLoader from '@/components/ui/PageLoader';
import { useContracts } from '@/hooks/useContracts';

export default function ContractsPage() {
  const { contracts, loading, role, wallet } = useContracts();

  if (loading) return <PageLoader />;

  const contributorMode = role === 'contributor';
  const visibleContracts = contributorMode
    ? contracts.filter((contract) => contract.contributorWallet === wallet)
    : contracts.filter((contract) => contract.clientWallet === wallet);

  return (
    <WalletGuard>
      <div className="screen-content">
        <Topbar
          title={contributorMode ? 'My contracts' : 'Contracts'}
          right={
            !contributorMode && (
              <Link href="/create" className="btn btn-primary">
                <Icon name="plus" size={14} />
                New contract
              </Link>
            )
          }
        />
        <div className="content-pad">
          <div className="content-surface" style={{ padding: 18 }}>
            <div className="section-head">
              <div className="section-title">
                {contributorMode ? 'Assigned to me' : 'Created by me'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                {visibleContracts.length} entries
              </div>
            </div>
            {visibleContracts.length === 0 ? (
              <div className="empty-state compact">
                <div className="empty-title">
                  {contributorMode ? 'No contributor contracts' : 'No client contracts'}
                </div>
                <div className="empty-copy">
                  {contributorMode
                    ? 'When a client adds your wallet to a contract, it appears here.'
                    : 'Create a contract to lock milestone payments in escrow.'}
                </div>
              </div>
            ) : (
              visibleContracts.map((contract) => (
                <ContractRow key={contract.id} contract={contract} />
              ))
            )}
          </div>
        </div>
      </div>
    </WalletGuard>
  );
}
