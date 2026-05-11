'use client';

import Topbar from '@/components/layout/Topbar';
import WalletGuard from '@/components/ui/WalletGuard';

export default function SettingsPage() {
  return (
    <WalletGuard>
      <div className="screen-content">
        <Topbar title="Settings" />

        <div className="content-pad">
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">Display name</label>
              <input className="form-input" placeholder="Your DAO, team, or contributor name" />
            </div>

            <div className="form-group">
              <label className="form-label">Default approval threshold</label>
              <select className="form-input" style={{ cursor: 'pointer' }}>
                <option>1 of 1 (single approver)</option>
                <option>2 of 3 (future multisig)</option>
                <option>3 of 5 (future multisig)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notification email</label>
              <input className="form-input" placeholder="optional@email.com" type="email" />
              <div className="field-help">
                Optional only. Wallet remains the primary identity.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Default network</label>
              <select className="form-input" style={{ cursor: 'pointer' }}>
                <option>Solana Devnet</option>
                <option disabled>Solana Mainnet-Beta (after audit)</option>
              </select>
            </div>

            <button className="btn btn-primary">Save settings</button>
          </div>
        </div>
      </div>
    </WalletGuard>
  );
}
