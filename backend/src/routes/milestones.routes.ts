import { Router } from 'express';
import { z } from 'zod';
import { walletAuth } from '../middleware/auth.middleware';
import { memory, pushNotification } from '../store/memory';

export const milestoneRoutes = Router();

milestoneRoutes.use(walletAuth);

milestoneRoutes.post('/:id/submit', (req, res) => {
  const body = z
    .object({
      contractId: z.string(),
      proofUrl: z.string().url().optional(),
      txSignature: z.string().optional(),
    })
    .parse(req.body);

  const contract = memory.contracts.get(body.contractId);
  const milestone = contract?.milestones.find((item) => item.id === req.params.id);

  if (!contract || !milestone) {
    res.status(404).json({ ok: false, error: 'Milestone not found' });
    return;
  }

  if (contract.contributorWallet !== req.walletAddress) {
    res.status(403).json({ ok: false, error: 'Only contributor can submit' });
    return;
  }

  milestone.status = 'SUBMITTED';
  milestone.proofUrl = body.proofUrl;
  milestone.txSignature = body.txSignature;
  milestone.submittedAt = new Date().toISOString();

  pushNotification({
    walletAddress: contract.clientWallet,
    type: 'milestone_submitted',
    message: `${milestone.title} submitted for review`,
  });

  res.json({ ok: true, milestone });
});

milestoneRoutes.post('/:id/release', (req, res) => {
  const body = z
    .object({
      contractId: z.string(),
      txSignature: z.string().optional(),
    })
    .parse(req.body);

  const contract = memory.contracts.get(body.contractId);
  const milestone = contract?.milestones.find((item) => item.id === req.params.id);

  if (!contract || !milestone) {
    res.status(404).json({ ok: false, error: 'Milestone not found' });
    return;
  }

  if (contract.clientWallet !== req.walletAddress) {
    res.status(403).json({ ok: false, error: 'Only client can release' });
    return;
  }

  milestone.status = 'RELEASED';
  milestone.txSignature = body.txSignature;
  milestone.releasedAt = new Date().toISOString();

  if (contract.milestones.every((item) => item.status === 'RELEASED')) {
    contract.status = 'COMPLETED';
  }

  pushNotification({
    walletAddress: contract.contributorWallet,
    type: 'payment_released',
    message: `${milestone.amountUsdc} USDC released for ${milestone.title}`,
  });

  res.json({ ok: true, milestone });
});
