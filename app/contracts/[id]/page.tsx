'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import Topbar from '@/components/layout/Topbar';
import MilestoneItem from '@/components/ui/MilestoneItem';
import StatusBadge from '@/components/ui/StatusBadge';
import Avatar from '@/components/ui/Avatar';
import ActivityFeed from '@/components/ui/ActivityFeed';
import Icon from '@/components/ui/Icon';
import ProgressBar from '@/components/ui/ProgressBar';
import WalletGuard from '@/components/ui/WalletGuard';
import { Contract } from '@/types';
import { getContractById, updateMilestoneStatus } from '@/lib/storage';
import { formatUSDC } from '@/lib/utils';

const CONTRACT_ACTIVITY = [
  {
    color: 'var(--purple-l)',
    text: 'Milestone submitted for review',
    time: 'Just now',
  },
  {
    color: 'var(--green)',
    text: 'USDC release confirmed',
    time: 'Earlier',
  },
  {
    color: 'var(--amber)',
    text: 'Contract funded in demo mode',
    time: 'Today',
  },
];

export default function ContractDetailPage({ params }: { params: { id: string } }) {
  const { publicKey } = useWallet();
  const [tab, setTab] = useState<'milestones' | 'activity' | 'details'>('milestones');
  const [contract, setContract] = useState<Contract | undefined>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setContract(getContractById(params.id));
  }, [params.id]);

  const role = useMemo<'client' | 'contributor' | 'viewer'>(() => {
    if (!publicKey || !contract) return 'viewer';
    const wallet = publicKey.toString();
    if (wallet === contract.clientWallet) return 'client';
    if (wallet === contract.contributorWallet) return 'contributor';
    return 'viewer';
  }, [publicKey, contract]);

  if (contract === undefined && typeof window === 'undefined') notFound();
  if (!contract) {
    return (
      <WalletGuard>
        <div className="screen-content">
          <Topbar title="Contract not found" />
          <div className="content-pad">
            <div className="empty-state">
              <div className="empty-title">Contract not found</div>
              <div className="empty-copy">Check the link or create a new contract.</div>
              <Link href="/create" className="btn btn-primary">
                <Icon name="plus" size={14} />
                New contract
              </Link>
            </div>
          </div>
        </div>
      </WalletGuard>
    );
  }

  const details = [
    { label: 'Contract ID', value: contract.id, mono: true },
    { label: 'Created', value: contract.createdAt ?? '-' },
    { label: 'Escrow PDA', value: contract.escrowPda ?? '-', mono: true },
    { label: 'Client wallet', value: contract.clientWallet, mono: true },
    { label: 'Contributor wallet', value: contract.contributorWallet, mono: true },
    { label: 'Network', value: 'Solana Devnet' },
  ];

  const roleBadge = {
    client: { label: 'You are client', className: 'role-client' },
    contributor: { label: 'You are contributor', className: 'role-contributor' },
    viewer: { label: 'Viewer', className: 'role-viewer' },
  }[role];

  const refreshContract = () => {
    setContract(getContractById(params.id));
  };

  const handleSubmit = (milestoneId: string) => {
    updateMilestoneStatus(contract.id, milestoneId, 'submit');
    refreshContract();
  };

  const handleApprove = (milestoneId: string) => {
    updateMilestoneStatus(contract.id, milestoneId, 'approve');
    refreshContract();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <WalletGuard>
      <div className="screen-content">
        <Topbar
          left={
            <>
              <Link href="/contracts" className="btn btn-ghost btn-sm">
                <Icon name="arrow_left" size={13} />
                Back
              </Link>
              <div className="page-heading">{contract.title}</div>
              <StatusBadge status={contract.status} />
              <span className={`role-badge ${roleBadge.className}`}>{roleBadge.label}</span>
            </>
          }
          right={
            role === 'client' ? (
              <button className="btn btn-green btn-sm" onClick={handleCopy}>
                <Icon name="copy" size={13} />
                {copied ? 'Copied' : 'Share link'}
              </button>
            ) : role === 'contributor' ? (
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                Submit milestones when ready
              </span>
            ) : null
          }
        />

        <div className="content-pad">
          {role === 'contributor' && (
            <div className="escrow-proof">
              <Icon name="lock" size={16} />
              <div>
                <div className="escrow-proof-title">
                  {formatUSDC(contract.usdc)} USDC assigned to this contract
                </div>
                <div className="escrow-proof-copy">
                  In devnet mode this will map to the on-chain escrow vault.
                </div>
              </div>
            </div>
          )}

          <div className="contract-stat-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card" style={{ padding: '14px 16px' }}>
              <div className="stat-label">
                {role === 'contributor' ? 'Client' : 'Contributor'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                <Avatar
                  initials={contract.initials}
                  color={contract.color}
                  size={32}
                  fontSize={11}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                    {role === 'contributor' ? contract.clientName : contract.contributor}
                  </div>
                  <div className="mono-small">
                    {role === 'contributor'
                      ? contract.clientWallet
                      : contract.contributorWallet}
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card" style={{ padding: '14px 16px' }}>
              <div className="stat-label">Escrowed value</div>
              <div className="stat-number-purple">
                {formatUSDC(contract.usdc)}{' '}
                <span style={{ fontSize: 13, color: 'var(--text3)' }}>USDC</span>
              </div>
            </div>

            <div className="stat-card" style={{ padding: '14px 16px' }}>
              <div className="stat-label">Progress</div>
              <div className="stat-number">
                {contract.done}{' '}
                <span style={{ color: 'var(--text3)', fontSize: 14 }}>
                  / {contract.milestones} milestones
                </span>
              </div>
              <ProgressBar
                done={contract.done}
                total={contract.milestones}
                status={contract.status}
                height={4}
              />
            </div>
          </div>

          {role === 'client' && (
            <div className="share-strip">
              <div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                  Send this contract link to the contributor
                </div>
                <div className="share-url">/contracts/{params.id}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
                <Icon name="copy" size={13} />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}

          <div className="tabs">
            {(['milestones', 'activity', 'details'] as const).map((item) => (
              <div
                key={item}
                className={`tab ${tab === item ? 'active' : ''}`}
                onClick={() => setTab(item)}
                style={{ textTransform: 'capitalize' }}
              >
                {item}
              </div>
            ))}
          </div>

          {tab === 'milestones' && (
            <div>
              {contract.milestoneItems.map((milestone) => (
                <MilestoneItem
                  key={milestone.id}
                  milestone={milestone}
                  view={role}
                  onApprove={handleApprove}
                  onSubmit={handleSubmit}
                />
              ))}
            </div>
          )}

          {tab === 'activity' && <ActivityFeed items={CONTRACT_ACTIVITY} />}

          {tab === 'details' && (
            <div className="info-grid">
              {details.map((detail) => (
                <div key={detail.label} className="info-card">
                  <div className="info-label">{detail.label}</div>
                  <div className={detail.mono ? 'info-value mono-break' : 'info-value'}>
                    {detail.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </WalletGuard>
  );
}
