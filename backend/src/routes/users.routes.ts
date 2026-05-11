import { Router } from 'express';
import { z } from 'zod';
import { walletAuth } from '../middleware/auth.middleware';
import { ensureUser, memory } from '../store/memory';

export const userRoutes = Router();

userRoutes.use(walletAuth);

userRoutes.get('/me', (req, res) => {
  res.json({ ok: true, user: ensureUser(req.walletAddress!) });
});

userRoutes.patch('/me', (req, res) => {
  const body = z
    .object({
      displayName: z.string().max(80).optional(),
      email: z.string().email().optional().or(z.literal('')),
      bio: z.string().max(240).optional(),
    })
    .parse(req.body);

  const current = ensureUser(req.walletAddress!);
  const next = { ...current, ...body };
  memory.users.set(req.walletAddress!, next);
  res.json({ ok: true, user: next });
});
