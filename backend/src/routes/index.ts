import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { contractRoutes } from './contracts.routes';
import { milestoneRoutes } from './milestones.routes';
import { notificationRoutes } from './notifications.routes';
import { userRoutes } from './users.routes';

export const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/contracts', contractRoutes);
routes.use('/milestones', milestoneRoutes);
routes.use('/notifications', notificationRoutes);
