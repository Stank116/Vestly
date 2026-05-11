import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { routes } from './routes';
import { errorMiddleware } from './middleware/error.middleware';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.FRONTEND_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'vestly-backend' });
  });

  app.use('/api', routes);
  app.use(errorMiddleware);

  return app;
}
