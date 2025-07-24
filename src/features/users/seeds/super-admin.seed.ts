import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@shared/utils/hash.util';
import { ROLES } from '@shared/constants/roles.enum';
import { Logger } from '@nestjs/common';

const prisma = new PrismaClient();
const logger = new Logger('SeedSuperAdmin');

export async function seedSuperAdmin() {
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev) {
    logger.warn('SeedSuperAdmin skipped: not in development');
    return;
  }
  
  const exists = await prisma.user.findFirst({
    where: { role: ROLES.SUPERADMIN },
  });

  if (exists) {
    logger.log('SuperAdmin already exists, skipping');
    return;
  }

  const password = await hashPassword('admin123');

  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@raison.com',
      password,
      role: ROLES.SUPERADMIN,
      documentType: 'NIT',
      documentId: '123456789',
      isActive: true,
      createdBy: 'system',
      updatedBy: 'system',
    },
  });

  logger.log('SuperAdmin user created');
}
