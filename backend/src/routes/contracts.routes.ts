import { Router } from 'express';
import { z } from 'zod';
import { walletAuth } from '../middleware/auth.middleware';
import { memory, pushNotification, StoredContract } from '../store/memory';

export const contractRoutes = Router();

contractRoutes.use(walletAuth);

contractRoutes.get('/', (req, res) => {
  const wallet = req.walletAddress!;
  const contracts = [...memory.contracts.values()].filter(
    (contract) =>
      contract.clientWallet === wallet || contract.contributorWallet === wallet
  );

  res.json({ ok: true, contracts });
});

contractRoutes.get('/:id', (req, res) => {
  const contract = memory.contracts.get(req.params.id);

  if (!contract) {
    res.status(404).json({ ok: false, error: 'Contract not found' });
    return;
  }

  res.json({ ok: true, contract });
});

contractRoutes.post('/', (req, res) => {
  const body = z
    .object({
      id: z.string().optional(),
      pdaAddress: z.string().optional(),
      title: z.string().min(1).max(120),
      totalUsdc: z.number().positive(),
      contributorWallet: z.string().min(32),
      milestones: z
        .array(
          z.object({
            title: z.string().min(1).max(120),
            description: z.string().max(500).optional(),
            amountUsdc: z.number().positive(),
          })
        )
        .min(1),
    })
    .parse(req.body);

  const id = body.id ?? `contract-${Date.now()}`;
  const contract: StoredContract = {
    id,
    pdaAddress: body.pdaAddress,
    title: body.title,
    totalUsdc: body.totalUsdc,
    clientWallet: req.walletAddress!,
    contributorWallet: body.contributorWallet,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    milestones: body.milestones.map((milestone, index) => ({
      id: `${id}-ms-${index}`,
      contractId: id,
      index,
      title: milestone.title,
      description: milestone.description,
      amountUsdc: milestone.amountUsdc,
      status: 'LOCKED',
    })),
  };

  memory.contracts.set(id, contract);
  pushNotification({
    walletAddress: body.contributorWallet,
    type: 'contract_created',
    message: `New Vestly contract: ${body.title}`,
  });

  res.status(201).json({ ok: true, contract });
});
