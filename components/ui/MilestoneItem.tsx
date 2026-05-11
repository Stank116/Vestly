import { Milestone } from '@/types';
import Icon from '@/components/ui/Icon';
import { getMilestoneIconClass, formatUSDC } from '@/lib/utils';

interface MilestoneItemProps {
  milestone: Milestone;
  view?: 'client' | 'contributor' | 'viewer';
  onApprove?: (id: string) => void;
  onSubmit?: (id: string) => void;
}

export default function MilestoneItem({
  milestone,
  view = 'client',
  onApprove,
  onSubmit,
}: MilestoneItemProps) {
  const { id, title, desc, usdc, status, tx } = milestone;
  const iconClass = getMilestoneIconClass(status);

  return (
    <div className={`milestone-item ${status === 'review' ? 'active' : ''}`}>
      <div className={`m-icon ${iconClass}`}>
        {status === 'done' && <Icon name="check" size={12} />}
        {status === 'review' && <Icon name="clock" size={12} />}
        {status === 'locked' && <Icon name="lock" size={12} />}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: status === 'locked' ? 'var(--text3)' : 'var(--text)',
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
          {desc}
        </div>
        {tx && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text3)',
              marginTop: 4,
            }}
          >
            tx: {tx}
          </div>
        )}
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

        {status === 'done' && (
          <div style={{ fontSize: 10, color: 'var(--green)', marginTop: 3 }}>Paid</div>
        )}
        {status === 'locked' && (
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3 }}>
            Pending
          </div>
        )}
        {status === 'review' && view === 'client' && (
          <button
            className="btn btn-green btn-sm"
            style={{ marginTop: 6 }}
            onClick={() => onApprove?.(id)}
          >
            Approve and release
          </button>
        )}
        {status === 'review' && view === 'contributor' && (
          <div style={{ fontSize: 10, color: '#818cf8', marginTop: 3 }}>
            Under review
          </div>
        )}
        {status === 'locked' && view === 'contributor' && (
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 6 }}
            onClick={() => onSubmit?.(id)}
          >
            Submit work
          </button>
        )}
      </div>
    </div>
  );
}
