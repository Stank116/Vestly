import { Bounty } from '@/types';

export const BOUNTIES: Bounty[] = [
  {
    id: 'staking-program',
    title: 'Build Solana staking program',
    sponsor: 'Nova DAO',
    category: 'Development',
    skills: ['Rust', 'Anchor', 'SPL'],
    budgetUsdc: 5000,
    milestones: 4,
    applicants: 12,
    deadline: 'Jun 30',
    summary:
      'Design and ship a staking flow with deposit, withdraw, reward accounting, and tests.',
    status: 'open',
  },
  {
    id: 'brand-kit',
    title: 'Create token launch brand kit',
    sponsor: 'Helio Guild',
    category: 'Design',
    skills: ['Figma', 'Brand', 'Motion'],
    budgetUsdc: 2400,
    milestones: 3,
    applicants: 8,
    deadline: 'Jun 18',
    summary:
      'Produce logo system, launch graphics, token card visuals, and social templates.',
    status: 'selecting',
  },
  {
    id: 'audit-notes',
    title: 'Write audit findings report',
    sponsor: 'Vector Labs',
    category: 'Writing',
    skills: ['Security', 'Technical writing'],
    budgetUsdc: 1200,
    milestones: 2,
    applicants: 5,
    deadline: 'Jun 21',
    summary:
      'Turn raw audit notes into a clear contributor-facing security report.',
    status: 'funded',
  },
  {
    id: 'community-ops',
    title: 'Run contributor onboarding sprint',
    sponsor: 'Orbit Collective',
    category: 'Operations',
    skills: ['Discord', 'Notion', 'Community'],
    budgetUsdc: 1800,
    milestones: 3,
    applicants: 9,
    deadline: 'Jul 4',
    summary:
      'Set up onboarding docs, contributor intake, and first-week workflow for new builders.',
    status: 'open',
  },
];
