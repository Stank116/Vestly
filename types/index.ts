export type ContractStatus = 'active' | 'review' | 'pending' | 'paid';
export type MilestoneStatus = 'done' | 'review' | 'locked';
export type UserRole = 'client' | 'contributor' | 'both' | 'new';

export interface Milestone {
  id: string;
  index: number;
  title: string;
  desc: string;
  usdc: number;
  status: MilestoneStatus;
  tx: string | null;
}

export interface Contract {
  id: string;
  title: string;
  clientName: string;
  clientWallet: string;
  contributor: string;
  contributorWallet: string;
  initials: string;
  color: 'av-purple' | 'av-teal' | 'av-amber' | 'av-blue';
  usdc: number;
  releasedUsdc: number;
  milestones: number;
  done: number;
  status: ContractStatus;
  due: string;
  escrowPda?: string;
  createdAt?: string;
  milestoneItems: Milestone[];
}

export interface Payment {
  id: number;
  label: string;
  hash: string;
  amt: number;
  date: string;
}

export interface ActivityItem {
  color: string;
  text: string;
  time: string;
}

export interface Bounty {
  id: string;
  title: string;
  sponsor: string;
  category: 'Development' | 'Design' | 'Writing' | 'Operations';
  skills: string[];
  budgetUsdc: number;
  milestones: number;
  applicants: number;
  deadline: string;
  summary: string;
  status: 'open' | 'selecting' | 'funded';
}
