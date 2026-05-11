import { NextFunction, Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      walletAddress?: string;
    }
  }
}

export function walletAuth(req: Request, res: Response, next: NextFunction) {
  const wallet = req.header('x-wallet-address');

  if (!wallet) {
    res.status(401).json({ ok: false, error: 'Missing x-wallet-address header' });
    return;
  }

  req.walletAddress = wallet;
  next();
}
