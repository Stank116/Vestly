'use client';

import Topbar from '@/components/layout/Topbar';
import StatCard from '@/components/ui/StatCard';
import Icon from '@/components/ui/Icon';
import WalletGuard from '@/components/ui/WalletGuard';
import { useContracts } from '@/hooks/useContracts';
import { getPaymentsForWallet } from '@/lib/storage';

export default function EarningsPage() {
  const { wallet } = useContracts();
  const payments = wallet ? getPaymentsForWallet(wallet, 'received') : [];
  const total = payments.reduce((sum, payment) => sum + payment.amt, 0);

  return (
    <WalletGuard>
      <div className="screen-content">
        <Topbar
          title="Earnings"
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
              label="Total earned"
              value={`$${total.toLocaleString()}`}
              sub="USDC received"
              valueColor="var(--green)"
            />
            <StatCard
              label="Payments"
              value={String(payments.length)}
              sub="Milestones released"
              subColor="var(--green)"
            />
            <StatCard label="Settlement" value="<1s" sub="Solana devnet target" />
          </div>

          <div className="content-surface" style={{ padding: '4px 16px' }}>
            {payments.length === 0 ? (
              <div className="empty-state compact">
                <div className="empty-title">No earnings yet</div>
                <div className="empty-copy">
                  When clients approve milestones, USDC payments appear here.
                </div>
              </div>
            ) : (
              payments.map((payment) => (
                <div className="plog-row" key={`${payment.hash}-${payment.id}`}>
                  <div className="plog-icon-wrap">
                    <Icon name="arrow_up" size={13} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="plog-name">{payment.label}</div>
                    <div className="plog-hash">tx: {payment.hash}</div>
                  </div>
                  <div className="plog-amt">+${payment.amt.toLocaleString()}</div>
                  <div className="plog-date">{payment.date}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </WalletGuard>
  );
}
