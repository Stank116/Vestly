import { Contract } from '@/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function hasBackend() {
  return Boolean(BACKEND_URL);
}

async function request(path: string, options: RequestInit & { wallet?: string } = {}) {
  if (!hasBackend()) return null;

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.wallet) {
    headers.set('x-wallet-address', options.wallet);
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return response.json();
}

export async function mirrorContractToBackend(contract: Contract) {
  if (!hasBackend()) return;

  await request('/api/contracts', {
    method: 'POST',
    wallet: contract.clientWallet,
    body: JSON.stringify({
      id: contract.id,
      pdaAddress: contract.escrowPda,
      title: contract.title,
      totalUsdc: contract.usdc,
      contributorWallet: contract.contributorWallet,
      milestones: contract.milestoneItems.map((milestone) => ({
        title: milestone.title,
        description: milestone.desc,
        amountUsdc: milestone.usdc,
      })),
    }),
  });
}

export async function mirrorMilestoneSubmit(input: {
  wallet: string;
  contractId: string;
  milestoneId: string;
  txSignature?: string;
}) {
  if (!hasBackend()) return;

  await request(`/api/milestones/${input.milestoneId}/submit`, {
    method: 'POST',
    wallet: input.wallet,
    body: JSON.stringify({
      contractId: input.contractId,
      txSignature: input.txSignature,
    }),
  });
}

export async function mirrorMilestoneRelease(input: {
  wallet: string;
  contractId: string;
  milestoneId: string;
  txSignature?: string;
}) {
  if (!hasBackend()) return;

  await request(`/api/milestones/${input.milestoneId}/release`, {
    method: 'POST',
    wallet: input.wallet,
    body: JSON.stringify({
      contractId: input.contractId,
      txSignature: input.txSignature,
    }),
  });
}
