import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const rawPrisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = rawPrisma;

// Create a mock Prisma Client Proxy when DATABASE_URL is missing
const mockPrisma: any = new Proxy({}, {
  get(target, prop) {
    if (prop === '$transaction') {
      return async (callback: any) => {
        if (typeof callback === 'function') {
          return callback(mockPrisma);
        }
        return [];
      };
    }
    if (prop === '$connect' || prop === '$disconnect') {
      return async () => {};
    }
    
    return new Proxy({}, {
      get(modelTarget, method) {
        return async () => {
          console.warn(`⚠️ [PRISMA MOCK] Called prisma.${String(prop)}.${String(method)} because DATABASE_URL is not set.`);
          if (method === 'findMany') return [];
          if (method === 'count') return 0;
          if (method === 'deleteMany') return { count: 0 };
          return null;
        };
      }
    });
  }
});

const isDatabaseConfigured = 
  !!process.env.DATABASE_URL && 
  (process.env.DATABASE_URL.startsWith('postgresql://') || process.env.DATABASE_URL.startsWith('postgres://'));

export const prisma = (isDatabaseConfigured ? rawPrisma : mockPrisma) as PrismaClient;
