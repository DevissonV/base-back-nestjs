import { Logger } from '@nestjs/common';
import { seedSuperAdmin } from '../../src/features/users/seeds/super-admin.seed';

const logger = new Logger('SeedRunner');

async function main() {
  logger.log('Starting seed process...');
  await seedSuperAdmin();
  logger.log('All seeds completed.');
}

main()
  .catch((e) => {
    logger.error('Seeding failed', e);
    process.exit(1);
  });
