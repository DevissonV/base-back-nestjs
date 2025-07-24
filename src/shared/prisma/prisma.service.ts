import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService encapsulates PrismaClient and manages its lifecycle within the NestJS application.
 * Ensures the DB connection is properly established and closed.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Initializes the Prisma client when the module is bootstrapped.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Gracefully disconnects Prisma when the application shuts down.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
