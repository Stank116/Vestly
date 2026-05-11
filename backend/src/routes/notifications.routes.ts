import { Router } from 'express';
import { walletAuth } from '../middleware/auth.middleware';
import { memory } from '../store/memory';

export const notificationRoutes = Router();

notificationRoutes.use(walletAuth);

notificationRoutes.get('/', (req, res) => {
  res.json({
    ok: true,
    notifications: memory.notifications.get(req.walletAddress!) ?? [],
  });
});
