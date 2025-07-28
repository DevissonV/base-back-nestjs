import { Injectable } from '@nestjs/common';
import { GenericCriteria } from './generic-criteria';

@Injectable()
export class CriteriaService {
  async getAll<T>({
    dto,
    filterMap,
    repository,
    orderBy = { createdAt: 'desc' },
  }: {
    dto: any;
    filterMap: Record<string, { column: string; operator: '=' | 'ILIKE' }>;
    repository: {
      findWithCriteria(args: {
        where: any;
        skip: number;
        take: number;
        orderBy?: any;
      }): Promise<{ data: T[]; total: number }>;
    };
    orderBy?: Record<string, 'asc' | 'desc'>;
  }): Promise<{
    data: T[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const criteria = new GenericCriteria(dto, filterMap);
      const where = criteria.buildWhereClause();
      const { skip, take, page, limit } = criteria.getPagination();

      const { data, total } = await repository.findWithCriteria({
        where,
        skip,
        take,
        orderBy,
      });

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('[CriteriaService][ERROR]', error);
      throw error;
    }
  }
}
