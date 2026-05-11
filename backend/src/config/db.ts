import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var vestlyPrisma: PrismaClient | undefined;
}

export const prisma = globalThis.vestlyPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.vestlyPrisma = prisma;
}
