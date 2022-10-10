import { PrismaClient } from '@prisma/client'

async function excludePasswordMiddlware(params: any, next: any) {
    const result = await next(params);
    if (params?.model === 'user' && params?.args?.select?.password !== true) {
      if (result) {
        delete result.password;
      }
    }

    return result;
  }
  
  
const prisma = new PrismaClient();
prisma.$use(excludePasswordMiddlware);

export { prisma };
