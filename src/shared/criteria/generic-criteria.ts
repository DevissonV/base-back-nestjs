import { CriteriaConfig } from './criteria.types';

/**
 * A generic criteria builder for filtering and paginating queries.
 *
 * @remarks
 * This class constructs a Prisma-compatible `where` clause and pagination
 * options based on a validated DTO and a filter map configuration.
 * Supports equality (`=`) and case-insensitive partial match (`ILIKE`) operators.
 *
 * @example
 * ```ts
 * const dto = { name: 'John', isActive: undefined, page: 2, limit: 5 };
 * const filters = { name: { column: 'name', operator: 'ILIKE' } };
 * const criteria = new GenericCriteria(dto, filters);
 * const where = criteria.buildWhereClause(); // Prisma where object
 * const { skip, take } = criteria.getPagination(); // pagination values
 * ```
 */
export class GenericCriteria {
  private dto: Record<string, any>;
  private filters: CriteriaConfig;

  constructor(dto: Record<string, any>, filters: CriteriaConfig) {
    this.dto = dto;
    this.filters = filters;
  }

  /**
   * Builds the `where` clause for a Prisma query using the provided DTO and filter config.
   *
   * @returns An object suitable for Prisma's `where` parameter.
   */
  buildWhereClause(): Record<string, any> {
    const where: Record<string, any> = {};

    for (const [key, config] of Object.entries(this.filters)) {
      const value = this.dto[key];
      if (value === undefined) continue;

      switch (config.operator) {
        case '=':
          where[config.column] = value;
          break;
        case 'ILIKE':
          where[config.column] = {
            contains: value,
            mode: 'insensitive',
          };
          break;
      }
    }

    if (this.dto.isActive === undefined) {
      where.isActive = true;
    }

    return where;
  }

  /**
   * Computes pagination values from the DTO (page, limit).
   *
   * @returns Pagination data: `skip`, `take`, `page`, and `limit`.
   */
  getPagination(): { skip: number; take: number; page: number; limit: number } {
    const limit = Math.max(1, this.dto.limit ?? 10);
    const page = Math.max(1, this.dto.page ?? 1);
    const skip = (page - 1) * limit;

    return { skip, take: limit, page, limit };
  }
}
