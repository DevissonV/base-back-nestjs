import { SearchUsersDto } from '../dtos/search-user.dto';

export class UserCriteria {
  constructor(private readonly dto: SearchUsersDto) {}

  buildWhereClause() {
  const where: any = {};

  if (this.dto.isActive === undefined) {
    where.isActive = true;
  } else {
    where.isActive = this.dto.isActive;
  }

  if (this.dto.username) {
    where.username = { contains: this.dto.username, mode: 'insensitive' };
  }

  if (this.dto.email) {
    where.email = { contains: this.dto.email, mode: 'insensitive' };
  }

  if (this.dto.role) {
    where.role = this.dto.role;
  }

  if (this.dto.phoneNumber) {
    where.phoneNumber = { contains: this.dto.phoneNumber };
  }

  if (this.dto.documentId) {
    where.documentId = { contains: this.dto.documentId };
  }

  if (this.dto.documentType) {
    where.documentType = this.dto.documentType;
  }

  return where;
}

  getPagination() {
    const limit = this.dto.limit ?? 10;
    const page = this.dto.page ?? 1;
    const skip = (page - 1) * limit;
    return { skip, take: limit, page, limit };
  }
}
