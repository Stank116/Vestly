export type StoredUser = {
  walletAddress: string;
  displayName?: string;
  email?: string;
  bio?: string;
  createdAt: string;
};

export type StoredMilestone = {
  id: string;
  contractId: string;
  pdaAddress?: string;
  index: number;
  title: string;
  description?: string;
  amountUsdc: number;
  status: 'LOCKED' | 'SUBMITTED' | 'RELEASED';
  proofUrl?: string;
  txSignature?: string;
  submittedAt?: string;
  releasedAt?: string;
};

export type StoredContract = {
  id: string;
  pdaAddress?: string;
  title: string;
  totalUsdc: number;
  clientWallet: string;
  contributorWallet: string;
  status: 'ACTIVE' | 'COMPLETED';
  createdAt: string;
  milestones: StoredMilestone[];
};

export type StoredNotification = {
  id: string;
  walletAddress: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export const memory = {
  users: new Map<string, StoredUser>(),
  contracts: new Map<string, StoredContract>(),
  notifications: new Map<string, StoredNotification[]>(),
};

export function ensureUser(walletAddress: string) {
  const existing = memory.users.get(walletAddress);
  if (existing) return existing;

  const user: StoredUser = {
    walletAddress,
    createdAt: new Date().toISOString(),
  };

  memory.users.set(walletAddress, user);
  return user;
}

export function pushNotification(input: Omit<StoredNotification, 'id' | 'read' | 'createdAt'>) {
  const item: StoredNotification = {
    ...input,
    id: `notif-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    read: false,
    createdAt: new Date().toISOString(),
  };

  const current = memory.notifications.get(input.walletAddress) ?? [];
  memory.notifications.set(input.walletAddress, [item, ...current]);
  return item;
}
