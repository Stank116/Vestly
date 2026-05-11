'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Topbar from '@/components/layout/Topbar';
import WalletGuard from '@/components/ui/WalletGuard';
import { createLocalContract } from '@/lib/storage';

interface MilestoneRow {
  desc: string;
  usdc: string;
}

export default function CreateContractPage() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [title, setTitle] = useState('');
  const [wallet, setWallet] = useState('');
  const [error, setError] = useState('');
  const [rows, setRows] = useState<MilestoneRow[]>([
    { desc: 'Initial deliverable', usdc: '' },
    { desc: '', usdc: '' },
  ]);

  const total = rows.reduce((sum, row) => sum + (parseFloat(row.usdc) || 0), 0);
  const filledRows = rows.filter((row) => row.desc.trim() && Number(row.usdc) > 0);

  const updateRow = (i: number, field: keyof MilestoneRow, val: string) => {
    const next = [...rows];
    next[i] = { ...next[i], [field]: val };
    setRows(next);
  };

  const addRow = () => setRows([...rows, { desc: '', usdc: '' }]);

  const removeRow = (i: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, idx) => idx !== i));
  };

  const handleSubmit = () => {
    setError('');

    if (!publicKey) {
      setError('Connect Phantom first.');
      return;
    }

    if (!title.trim()) {
      setError('Add a contract title.');
      return;
    }

    if (filledRows.length === 0) {
      setError('Add at least one milestone with a USDC amount.');
      return;
    }

    try {
      new PublicKey(wallet);
    } catch {
      setError('Enter a valid Solana contributor wallet address.');
      return;
    }

    const contract = createLocalContract({
      clientWallet: publicKey.toString(),
      contributorWallet: wallet,
      title: title.trim(),
      milestones: filledRows.map((row) => ({
        title: row.desc.trim(),
        usdc: Number(row.usdc),
      })),
    });

    router.push(`/contracts/${contract.id}`);
  };

  return (
    <WalletGuard>
      <div className="screen-content">
        <Topbar
          title="New contract"
          right={
            <button className="btn btn-ghost" onClick={() => router.back()}>
              Cancel
            </button>
          }
        />

        <div className="content-pad">
          <div className="content-surface form-section" style={{ padding: 20 }}>
            <p
              style={{
                fontSize: 12,
                color: 'var(--text3)',
                marginBottom: 22,
                lineHeight: 1.7,
              }}
            >
              This frontend creates a working demo contract in local browser
              storage. When your Anchor program is deployed, this submit action
              becomes the real devnet create and fund transaction.
            </p>

            <div className="form-group">
              <label className="form-label">Contract title</label>
              <input
                className="form-input"
                placeholder="e.g. Smart contract audit"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contributor wallet</label>
              <input
                className="form-input mono"
                placeholder="Paste contributor Phantom public key"
                value={wallet}
                onChange={(event) => setWallet(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Milestones</label>
              {rows.map((row, i) => (
                <div className="ms-builder-row" key={i} style={{ alignItems: 'center' }}>
                  <input
                    className="form-input"
                    placeholder={`Milestone ${i + 1} description`}
                    value={row.desc}
                    onChange={(event) => updateRow(i, 'desc', event.target.value)}
                  />
                  <input
                    className="form-input ms-amount"
                    placeholder="USDC"
                    type="number"
                    min="0"
                    value={row.usdc}
                    onChange={(event) => updateRow(i, 'usdc', event.target.value)}
                  />
                  {rows.length > 1 && (
                    <button
                      onClick={() => removeRow(i)}
                      className="icon-text-btn"
                      aria-label="Remove milestone"
                    >
                      x
                    </button>
                  )}
                </div>
              ))}
              <button className="add-ms" onClick={addRow}>
                Add milestone
              </button>
            </div>

            {total > 0 && (
              <div className="escrow-summary">
                <div className="summary-row">
                  <span style={{ fontSize: 12, color: '#a78bfa' }}>
                    Total to lock in escrow
                  </span>
                  <span className="summary-total">${total.toLocaleString()} USDC</span>
                </div>
                <div className="summary-row muted">
                  <span>
                    {filledRows.length} milestone{filledRows.length !== 1 ? 's' : ''}
                  </span>
                  <span>Released per milestone on approval</span>
                </div>
              </div>
            )}

            {error && <div className="form-error">{error}</div>}

            <button className="fund-btn" onClick={handleSubmit}>
              Create escrow contract
            </button>

            <p className="fine-print">
              Frontend demo mode is active. Real USDC escrow starts after Anchor
              program wiring.
            </p>
          </div>
        </div>
      </div>
    </WalletGuard>
  );
}
