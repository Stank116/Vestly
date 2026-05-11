import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { createLoginMessage, verifyWalletSignature } from '../utils/wallet';
import { ensureUser } from '../store/memory';

export const authRoutes = Router();

authRoutes.get('/nonce/:walletAddress', (req, res) => {
  const nonce = crypto.randomUUID();
  const message = createLoginMessage(req.params.walletAddress, nonce);
  res.json({ ok: true, nonce, message });
});

authRoutes.post(
  '/login',
  asyncHandler(async (req, res) => {
    const body = z
      .object({
        walletAddress: z.string().min(32),
        message: z.string().min(1),
        signature: z.string().min(1),
      })
      .parse(req.body);

    const valid = verifyWalletSignature(body);
    if (!valid) {
      res.status(401).json({ ok: false, error: 'Invalid wallet signature' });
      return;
    }

    const user = ensureUser(body.walletAddress);
    res.json({ ok: true, token: body.walletAddress, user });
  })
);
