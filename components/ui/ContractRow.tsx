'use client';

import Link from 'next/link';
import { Contract } from '@/types';
import Avatar from '@/components/ui/Avatar';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import { formatUSDC } from '@/lib/utils';

interface ContractRowProps {
  contract: Contract;
}

export default function ContractRow({ contract }: ContractRowProps) {
  const { id, title, contributor, initials, color, usdc, milestones, done, status, due } =
    contract;

  return (
    <Link href={`/contracts/${id}`} className="contract-row">
      <Avatar initials={initials} color={color} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
          {contributor} - {done}/{milestones} milestones - Due {due}
        </div>
        <ProgressBar done={done} total={milestones} status={status} />
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--purple-l)',
          }}
        >
          {formatUSDC(usdc)}
        </div>
        <div style={{ marginTop: 6 }}>
          <StatusBadge status={status} />
        </div>
      </div>
    </Link>
  );
}
