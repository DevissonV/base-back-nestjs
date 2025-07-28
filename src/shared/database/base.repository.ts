import { PrismaClient } from '@prisma/client';

/**
 * Abstract base repository class providing common CRUD operations for any Prisma model.
 *
 * @template T - The entity type associated with the repository.
 */
export abstract class BaseRepository<T> {
  /**
   * The Prisma model to be used (e.g., `this.prisma.user`).
   */
  protected abstract readonly model: any;

  /**
   * The shared Prisma client instance.
   */
  protected abstract readonly prisma: PrismaClient;

  /**
   * Persists a new entity in the database with a creation timestamp and default isActive.
   *
   * @param data - The data to create, including optional createdAt.
   * @returns The newly created record.
   */
  async create(data: Partial<T> & { createdAt?: Date }) {
    return this.model.create({
      data: {
        ...data,
        createdAt: new Date(),
        isActive: true,
      },
    });
  }

  /**
   * Retrieves all active records from the database.
   *
   * @returns An array of active records.
   */
  async findAll() {
    return this.model.findMany({
      where: { isActive: true },
    });
  }

  /**
   * Retrieves a single active record by its unique ID.
   *
   * @param id - The UUID of the entity to retrieve.
   * @returns The matching record if found and active, otherwise null.
   */
  async findById(id: string) {
    return this.model.findUnique({
      where: { id, isActive: true },
    });
  }

  /**
   * Updates an entity by its ID and sets the updatedAt timestamp.
   *
   * @param id - The UUID of the entity to update.
   * @param data - The fields to update.
   * @returns The updated record.
   */
  async updateById(id: string, data: Partial<T>) {
    return this.model.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Soft deletes an entity by marking it as inactive and setting deleted metadata.
   *
   * @param id - The UUID of the entity to delete.
   * @param deletedBy - The ID of the user who performed the deletion.
   * @returns The updated (soft-deleted) record.
   */
  async softDelete(id: string, deletedBy: string) {
    return this.model.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
        deletedBy,
      },
    });
  }

  /**
   * Performs a paginated query using provided filter criteria and returns data and total count.
   *
   * @param where - Prisma-compatible where clause.
   * @param skip - Number of records to skip (offset).
   * @param take - Number of records to take (limit).
   * @param orderBy - Optional Prisma orderBy clause.
   * @returns An object containing the matching data and total count.
   */
  async findWithCriteria({
    where,
    skip,
    take,
    orderBy,
  }: {
    where: any;
    skip: number;
    take: number;
    orderBy?: any;
  }) {
    const [data, total] = await this.prisma.$transaction([
      this.model.findMany({ where, skip, take, orderBy }),
      this.model.count({ where }),
    ]);
    return { data, total };
  }
}
