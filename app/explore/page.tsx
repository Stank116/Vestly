'use client';

import { useMemo, useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import WalletGuard from '@/components/ui/WalletGuard';
import Icon from '@/components/ui/Icon';
import { BOUNTIES } from '@/lib/bounties';
import { formatUSDC } from '@/lib/utils';

const CATEGORIES = ['All', 'Development', 'Design', 'Writing', 'Operations'] as const;

export default function ExplorePage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [applied, setApplied] = useState<Record<string, boolean>>({});

  const bounties = useMemo(() => {
    if (category === 'All') return BOUNTIES;
    return BOUNTIES.filter((bounty) => bounty.category === category);
  }, [category]);

  return (
    <WalletGuard>
      <div className="screen-content">
        <Topbar
          title="Explore bounties"
          right={
            <div className="pill-muted">
              <Icon name="lock" size={13} />
              Escrow starts after contributor selection
            </div>
          }
        />

        <div className="content-pad">
          <div className="explore-hero">
            <div>
              <div className="section-title">Public opportunities</div>
              <h1 className="explore-title">Find work that can convert into escrow.</h1>
              <p className="explore-copy">
                Browse public bounties, apply with your wallet, and let sponsors
                lock milestone payments once they select a contributor.
              </p>
            </div>
            <div className="explore-metric">
              <span>{formatUSDC(10400)}</span>
              <small>USDC listed</small>
            </div>
          </div>

          <div className="category-row">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                className={`category-chip ${category === item ? 'active' : ''}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="bounty-grid">
            {bounties.map((bounty) => (
              <div className="bounty-card" key={bounty.id}>
                <div className="bounty-top">
                  <div>
                    <div className="bounty-sponsor">{bounty.sponsor}</div>
                    <div className="bounty-title">{bounty.title}</div>
                  </div>
                  <span className={`bounty-status ${bounty.status}`}>
                    {bounty.status}
                  </span>
                </div>

                <p className="bounty-summary">{bounty.summary}</p>

                <div className="skill-row">
                  {bounty.skills.map((skill) => (
                    <span key={skill} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="bounty-meta">
                  <div>
                    <span>{formatUSDC(bounty.budgetUsdc)}</span>
                    <small>Budget</small>
                  </div>
                  <div>
                    <span>{bounty.milestones}</span>
                    <small>Milestones</small>
                  </div>
                  <div>
                    <span>{bounty.applicants}</span>
                    <small>Applicants</small>
                  </div>
                </div>

                <div className="bounty-footer">
                  <div className="deadline">Due {bounty.deadline}</div>
                  <button
                    className={applied[bounty.id] ? 'btn btn-green btn-sm' : 'btn btn-primary btn-sm'}
                    onClick={() =>
                      setApplied((current) => ({
                        ...current,
                        [bounty.id]: true,
                      }))
                    }
                  >
                    {applied[bounty.id] ? 'Interest sent' : 'Apply with wallet'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WalletGuard>
  );
}
