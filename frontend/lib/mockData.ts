import { ActivityItem, Contract, Payment } from '@/types';

export const DEMO_CLIENT_WALLET = 'DemoClient111111111111111111111111111111111';
export const DEMO_CONTRIBUTOR_WALLET = 'DemoContributor11111111111111111111111111';

export const CONTRACTS: Contract[] = [
  {
    id: 'audit-001',
    title: 'Smart contract audit',
    clientName: 'Vestly Labs',
    clientWallet: DEMO_CLIENT_WALLET,
    contributor: 'Arav Kumar',
    contributorWallet: DEMO_CONTRIBUTOR_WALLET,
    initials: 'AK',
    color: 'av-purple',
    usdc: 5200,
    releasedUsdc: 2500,
    milestones: 4,
    done: 2,
    status: 'review',
    due: 'Jun 12',
    escrowPda: '9xGmQ7...4wRz',
    createdAt: 'May 11, 2026',
    milestoneItems: [
      {
        id: 'audit-001-ms-1',
        index: 0,
        title: 'Initial codebase review',
        desc: 'Completed and paid',
        usdc: 1000,
        status: 'done',
        tx: '3xHpQ7...2mRq9a',
      },
      {
        id: 'audit-001-ms-2',
        index: 1,
        title: 'Vulnerability report draft',
        desc: 'Completed and paid',
        usdc: 1500,
        status: 'done',
        tx: '9aGmW4...5wXz1b',
      },
      {
        id: 'audit-001-ms-3',
        index: 2,
        title: 'Final audit report',
        desc: 'Submitted for client review',
        usdc: 2000,
        status: 'review',
        tx: null,
      },
      {
        id: 'audit-001-ms-4',
        index: 3,
        title: 'Post-fix verification',
        desc: 'Waiting for contributor submission',
        usdc: 700,
        status: 'locked',
        tx: null,
      },
    ],
  },
  {
    id: 'frontend-001',
    title: 'Frontend development',
    clientName: 'Vestly Labs',
    clientWallet: DEMO_CLIENT_WALLET,
    contributor: 'Maya Reyes',
    contributorWallet: 'DemoMaya11111111111111111111111111111111111',
    initials: 'MR',
    color: 'av-teal',
    usdc: 4500,
    releasedUsdc: 1200,
    milestones: 3,
    done: 1,
    status: 'active',
    due: 'Jun 28',
    escrowPda: '3kLpN2...8mQs',
    createdAt: 'May 11, 2026',
    milestoneItems: [
      {
        id: 'frontend-001-ms-1',
        index: 0,
        title: 'Dashboard shell',
        desc: 'Completed and paid',
        usdc: 1200,
        status: 'done',
        tx: '5mLqB3...1xWd4e',
      },
      {
        id: 'frontend-001-ms-2',
        index: 1,
        title: 'Contract detail flow',
        desc: 'Waiting for contributor submission',
        usdc: 1600,
        status: 'locked',
        tx: null,
      },
      {
        id: 'frontend-001-ms-3',
        index: 2,
        title: 'Wallet integration QA',
        desc: 'Waiting for contributor submission',
        usdc: 1700,
        status: 'locked',
        tx: null,
      },
    ],
  },
];

export const PAYMENTS: Payment[] = [
  { id: 1, label: 'Vulnerability report - Arav Kumar', hash: '9aGmW4...5wXz1b', amt: 1500, date: 'May 11, 2026' },
  { id: 2, label: 'Initial codebase review - Arav Kumar', hash: '3xHpQ7...2mRq9a', amt: 1000, date: 'May 11, 2026' },
  { id: 3, label: 'Dashboard shell - Maya Reyes', hash: '5mLqB3...1xWd4e', amt: 1200, date: 'May 11, 2026' },
];

export const ACTIVITY: ActivityItem[] = [
  { color: 'var(--purple-l)', text: 'Final audit report submitted by Arav Kumar', time: '2h ago' },
  { color: 'var(--green)', text: '$1,500 USDC released to Arav Kumar', time: '1d ago' },
  { color: 'var(--amber)', text: 'Frontend development is waiting on milestone 2', time: '2d ago' },
  { color: 'var(--green)', text: '$1,200 USDC released to Maya Reyes', time: '4d ago' },
];
