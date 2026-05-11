'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Topbar from '@/components/layout/Topbar';
import WalletGuard from '@/components/ui/WalletGuard';
import { createLocalContract } from '@/lib/storage';
import { createFundedContractOnChain, isOnChainConfigured } from '@/lib/anchorActions';

interface MilestoneRow {
  desc: string;
  usdc: string;
}

export default function CreateContractPage() {
  const router = useRouter();
  const walletAdapter = useWallet();
  const { publicKey } = walletAdapter;
  const [title, setTitle] = useState('');
  const [wallet, setWallet] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
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

  const handleSubmit = async () => {
    setError('');

    if (!publicKey) {
      setError('Connect a Solana wallet first.');
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

    let contributor: PublicKey;
    try {
      contributor = new PublicKey(wallet);
    } catch {
      setError('Enter a valid Solana contributor wallet address.');
      return;
    }

    const milestones = filledRows.map((row) => ({
        title: row.desc.trim(),
        usdc: Number(row.usdc),
      }));

    setBusy(true);

    try {
      if (isOnChainConfigured()) {
        const onChain = await createFundedContractOnChain({
          wallet: walletAdapter,
          contributor,
          title: title.trim(),
          milestones,
        });

        const contract = createLocalContract({
          clientWallet: publicKey.toString(),
          contributorWallet: contributor.toString(),
          title: title.trim(),
          milestones,
          escrowPda: onChain.contractPda.toString(),
          contractId: onChain.contractId.toString(),
          initializeTx: onChain.initializeSignature,
          fundTx: onChain.fundSignature,
          onChain: true,
        });

        router.push(`/contracts/${contract.id}`);
        return;
      }

      const contract = createLocalContract({
        clientWallet: publicKey.toString(),
        contributorWallet: contributor.toString(),
        title: title.trim(),
        milestones,
      });

      router.push(`/contracts/${contract.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not create escrow.');
    } finally {
      setBusy(false);
    }
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
              {isOnChainConfigured()
                ? 'Devnet mode is enabled. Creating a contract will ask your wallet to create, add milestones, and fund the escrow vault.'
                : 'Demo mode is active until the Anchor program is deployed and NEXT_PUBLIC_PROGRAM_ID is set.'}
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
                placeholder="Paste contributor Solana public key"
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

            <button className="fund-btn" onClick={handleSubmit} disabled={busy}>
              {busy ? 'Creating escrow...' : 'Create escrow contract'}
            </button>

            <p className="fine-print">
              {isOnChainConfigured()
                ? 'Real devnet transactions require devnet SOL and devnet USDC in your wallet.'
                : 'The local demo works without backend, Anchor, or devnet tokens.'}
            </p>
          </div>
        </div>
      </div>
    </WalletGuard>
  );
}
