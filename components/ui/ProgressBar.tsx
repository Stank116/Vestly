import { ContractStatus } from '@/types';
import { getProgressColor, progressPercent } from '@/lib/utils';

interface ProgressBarProps {
  done: number;
  total: number;
  status: ContractStatus;
  height?: number;
}

export default function ProgressBar({ done, total, status, height = 3 }: ProgressBarProps) {
  return (
    <div className="prog-track" style={{ height }}>
      <div
        className={`prog-fill ${getProgressColor(status)}`}
        style={{ width: `${progressPercent(done, total)}%` }}
      />
    </div>
  );
}
