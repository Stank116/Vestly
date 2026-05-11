import { ContractStatus, MilestoneStatus } from '@/types';

export function getProgressColor(status: ContractStatus): string {
  switch (status) {
    case 'active': return 'prog-green';
    case 'review': return 'prog-purple';
    case 'pending': return 'prog-amber';
    default:        return 'prog-green';
  }
}

export function getMilestoneIconClass(status: MilestoneStatus): string {
  switch (status) {
    case 'done':   return 'm-done';
    case 'review': return 'm-wait';
    case 'locked': return 'm-lock';
  }
}

export function formatUSDC(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export function progressPercent(done: number, total: number): number {
  return Math.round((done / total) * 100);
}
