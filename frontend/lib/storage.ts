'use client';

import { Contract, Milestone } from '@/types';
import { CONTRACTS, PAYMENTS } from './mockData';
import {
  mirrorContractToBackend,
  mirrorMilestoneRelease,
  mirrorMilestoneSubmit,
} from './backend';

const CONTRACT_KEY = 'vestly_contracts_v1';

function isBrowser() {
  return typeof window !== 'undefined';
}

function readStoredContracts(): Contract[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(CONTRACT_KEY);
    return raw ? (JSON.parse(raw) as Contract[]) : [];
  } catch {
    return [];
  }
}

function writeStoredContracts(contracts: Contract[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(CONTRACT_KEY, JSON.stringify(contracts));
}

export function getAllContracts(): Contract[] {
  return [...readStoredContracts(), ...CONTRACTS];
}

export function getContractsForWallet(wallet: string): Contract[] {
  return getAllContracts().filter(
    (contract) =>
      contract.clientWallet === wallet || contract.contributorWallet === wallet
  );
}

export function getContractById(id: string): Contract | undefined {
  return getAllContracts().find((contract) => contract.id === id);
}

export function createLocalContract(input: {
  clientWallet: string;
  contributorWallet: string;
  title: string;
  milestones: Array<{ title: string; usdc: number }>;
  escrowPda?: string;
  contractId?: string;
  initializeTx?: string;
  fundTx?: string;
  onChain?: boolean;
}): Contract {
  const total = input.milestones.reduce((sum, item) => sum + item.usdc, 0);
  const id = input.contractId ? `devnet-${input.contractId}` : `local-${Date.now()}`;
  const short = input.contributorWallet.slice(0, 4).toUpperCase();

  const milestoneItems: Milestone[] = input.milestones.map((item, index) => ({
    id: `${id}-ms-${index}`,
    index,
    title: item.title,
    desc: 'Waiting for contributor submission',
    usdc: item.usdc,
    status: 'locked',
    tx: null,
  }));

  const contract: Contract = {
    id,
    title: input.title,
    clientName: 'Connected wallet',
    clientWallet: input.clientWallet,
    contributor: `Contributor ${short}`,
    contributorWallet: input.contributorWallet,
    initials: short.slice(0, 2),
    color: 'av-purple',
    usdc: total,
    releasedUsdc: 0,
    milestones: milestoneItems.length,
    done: 0,
    status: 'active',
    due: input.onChain ? 'Devnet' : 'Demo',
    escrowPda: input.escrowPda ?? `${id.slice(-6)}...demo`,
    contractId: input.contractId,
    initializeTx: input.initializeTx,
    fundTx: input.fundTx,
    onChain: input.onChain ?? false,
    createdAt: new Date().toLocaleDateString(),
    milestoneItems,
  };

  const stored = readStoredContracts();
  writeStoredContracts([contract, ...stored]);
  void mirrorContractToBackend(contract).catch(() => undefined);
  return contract;
}

export function updateMilestoneStatus(
  contractId: string,
  milestoneId: string,
  action: 'submit' | 'approve',
  txSignature?: string
): Contract | undefined {
  const stored = readStoredContracts();
  const index = stored.findIndex((contract) => contract.id === contractId);
  if (index < 0) return getContractById(contractId);

  const contract = stored[index];
  const milestoneItems = contract.milestoneItems.map((milestone) => {
    if (milestone.id !== milestoneId) return milestone;

    if (action === 'submit' && milestone.status === 'locked') {
      return {
        ...milestone,
        status: 'review' as const,
        desc: 'Submitted for client review',
        submitTx: txSignature,
        tx: txSignature ?? milestone.tx,
      };
    }

    if (action === 'approve' && milestone.status === 'review') {
      return {
        ...milestone,
        status: 'done' as const,
        desc: 'Completed and paid',
        releaseTx: txSignature,
        tx: txSignature ?? `demo${Date.now().toString(36)}...devnet`,
      };
    }

    return milestone;
  });

  const done = milestoneItems.filter((milestone) => milestone.status === 'done').length;
  const releasedUsdc = milestoneItems
    .filter((milestone) => milestone.status === 'done')
    .reduce((sum, milestone) => sum + milestone.usdc, 0);

  const next: Contract = {
    ...contract,
    milestoneItems,
    done,
    releasedUsdc,
    status:
      done === milestoneItems.length
        ? 'paid'
        : milestoneItems.some((milestone) => milestone.status === 'review')
          ? 'review'
          : 'active',
  };

  const nextStored = [...stored];
  nextStored[index] = next;
  writeStoredContracts(nextStored);

  if (action === 'submit') {
    void mirrorMilestoneSubmit({
      wallet: contract.contributorWallet,
      contractId,
      milestoneId,
      txSignature,
    }).catch(() => undefined);
  }

  if (action === 'approve') {
    void mirrorMilestoneRelease({
      wallet: contract.clientWallet,
      contractId,
      milestoneId,
      txSignature,
    }).catch(() => undefined);
  }

  return next;
}

export function getPaymentsForWallet(wallet: string, direction: 'sent' | 'received') {
  const generated = getContractsForWallet(wallet)
    .flatMap((contract) =>
      contract.milestoneItems
        .filter((milestone) => milestone.status === 'done')
        .map((milestone) => ({
          id: Number(`${contract.id.replace(/\D/g, '').slice(-4) || 9}${milestone.index}`),
          label: `${milestone.title} - ${contract.contributor}`,
          hash: milestone.tx ?? 'confirmed...devnet',
          amt: milestone.usdc,
          date: contract.createdAt ?? 'Today',
          direction:
            contract.clientWallet === wallet ? 'sent' : 'received',
        }))
    )
    .filter((payment) => payment.direction === direction);

  if (generated.length > 0) return generated;
  return PAYMENTS.map((payment) => ({ ...payment, direction }));
}
