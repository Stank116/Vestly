'use client';

import { useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import StatCard from '@/components/ui/StatCard';
import Icon from '@/components/ui/Icon';
import WalletGuard from '@/components/ui/WalletGuard';
import { useContracts } from '@/hooks/useContracts';
import { getPaymentsForWallet } from '@/lib/storage';

export default function PaymentsPage() {
  const [search, setSearch] = useState('');
  const { wallet } = useContracts();
  const payments = wallet ? getPaymentsForWallet(wallet, 'sent') : [];

  const filtered = payments.filter((payment) =>
    payment.label.toLowerCase().includes(search.toLowerCase())
  );

  const total = payments.reduce((sum, payment) => sum + payment.amt, 0);

  return (
    <WalletGuard>
      <div className="screen-content">
        <Topbar
          title="Payment log"
          right={
            <button className="btn btn-ghost">
              <Icon name="download" size={14} />
              Export CSV
            </button>
          }
        />

        <div className="content-pad">
          <div className="stats-row" style={{ marginBottom: 24 }}>
            <StatCard
              label="Total paid out"
              value={`$${total.toLocaleString()}`}
              sub="USDC - all time"
              valueColor="var(--purple-l)"
            />
            <StatCard
              label="Transactions"
              value={String(payments.length)}
              sub="Confirmed in demo log"
              subColor="var(--green)"
            />
            <StatCard label="Token" value="USDC" sub="SPL stablecoin" />
          </div>

          <input
            className="form-input"
            style={{ marginBottom: 16 }}
            placeholder="Search by contributor or contract..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="content-surface" style={{ padding: '4px 16px' }}>
            {filtered.length === 0 && (
              <div className="empty-state compact">
                <div className="empty-title">No payment records</div>
                <div className="empty-copy">Approved milestones appear here.</div>
              </div>
            )}
            {filtered.map((payment) => (
              <div className="plog-row" key={`${payment.hash}-${payment.id}`}>
                <div className="plog-icon-wrap">
                  <Icon name="arrow_up" size={13} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="plog-name">{payment.label}</div>
                  <div className="plog-hash">
                    tx: {payment.hash} <Icon name="external" size={10} />
                  </div>
                </div>
                <div className="plog-amt">-${payment.amt.toLocaleString()}</div>
                <div className="plog-date">{payment.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WalletGuard>
  );
}
