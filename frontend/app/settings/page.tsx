'use client';

import { useEffect, useState } from 'react';
import { useContracts } from '@/hooks/useContracts';
import Topbar from '@/components/layout/Topbar';
import WalletGuard from '@/components/ui/WalletGuard';
import { getProfile, saveProfile, UserProfile } from '@/lib/profile';

export default function SettingsPage() {
  const { wallet } = useContracts();
  const [profile, setProfile] = useState<UserProfile>(() => getProfile(null));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(getProfile(wallet));
  }, [wallet]);

  const updateProfile = (field: keyof UserProfile, value: string) => {
    setSaved(false);
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSave = () => {
    if (!wallet) return;
    saveProfile(wallet, profile);
    setSaved(true);
  };

  return (
    <WalletGuard>
      <div className="screen-content">
        <Topbar title="Settings" />

        <div className="content-pad">
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">Display name</label>
              <input
                className="form-input"
                placeholder="Your DAO, team, or contributor name"
                value={profile.displayName}
                onChange={(event) => updateProfile('displayName', event.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Default approval threshold</label>
              <select
                className="form-input"
                style={{ cursor: 'pointer' }}
                value={profile.approvalThreshold}
                onChange={(event) =>
                  updateProfile('approvalThreshold', event.target.value)
                }
              >
                <option>1 of 1 (single approver)</option>
                <option>2 of 3 (future multisig)</option>
                <option>3 of 5 (future multisig)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notification email</label>
              <input
                className="form-input"
                placeholder="optional@email.com"
                type="email"
                value={profile.email}
                onChange={(event) => updateProfile('email', event.target.value)}
              />
              <div className="field-help">
                Optional only. Wallet remains the primary identity.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Default network</label>
              <select
                className="form-input"
                style={{ cursor: 'pointer' }}
                value={profile.network}
                onChange={(event) => updateProfile('network', event.target.value)}
              >
                <option>Solana Devnet</option>
                <option disabled>Solana Mainnet-Beta (after audit)</option>
              </select>
            </div>

            <button className="btn btn-primary" onClick={handleSave}>
              Save settings
            </button>
            {saved && (
              <div className="field-help" style={{ color: 'var(--green)', marginTop: 10 }}>
                Settings saved. Profile updated.
              </div>
            )}
          </div>
        </div>
      </div>
    </WalletGuard>
  );
}
