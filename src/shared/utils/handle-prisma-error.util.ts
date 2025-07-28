import { Prisma } from '@prisma/client';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

/**
 * Handles known Prisma errors and transforms them into meaningful HTTP exceptions.
 *
 * @param error - The error thrown by Prisma client.
 */
export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const target = (error.meta as any)?.target?.[0];

    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        throw new ConflictException(
          `A record with that ${target ?? 'field'} already exists`,
        );

      case 'P2025':
        // Record not found (used in some delete/update cases)
        throw new NotFoundException(
          `Record not found or already deleted`,
        );
    }
  }

  // Fallback for unhandled errors
  throw new InternalServerErrorException('Unexpected database error');
}
