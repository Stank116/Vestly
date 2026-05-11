import { ContractStatus } from '@/types';

interface StatusBadgeProps {
  status: ContractStatus;
}

const CONFIG: Record<ContractStatus, { cls: string; label: string }> = {
  active:  { cls: 'badge badge-active',  label: 'Active' },
  review:  { cls: 'badge badge-review',  label: 'In review' },
  pending: { cls: 'badge badge-pending', label: 'Pending' },
  paid:    { cls: 'badge badge-paid',    label: 'Completed' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { cls, label } = CONFIG[status];
  return <span className={cls}>{label}</span>;
}
