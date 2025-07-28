import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Persists a new user in the database.
   * @param data - User data including hashed password and audit metadata.
   * @returns The created user record.
   */
  async createUser(data: CreateUserDto & { password: string }) {
    return this.prisma.user.create({
      data: {
        ...data,
        isActive: true,
        createdAt: new Date(),
      },
    });
  }

  /**
   * Retrieves all active users from the database.
   * @returns A list of active user records.
   */
  async findAll() {
    return this.prisma.user.findMany({
      where: {
        isActive: true,
      },
    });
  }

  /**
   * Finds a user by ID, ensuring the user is active.
   * @param id - UUID of the user.
   * @returns The user record if found and active.
   */
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id, isActive: true },
    });
  }

  /**
   * Updates a user by ID with the provided data.
   * Automatically sets the updatedAt timestamp.
   * @param id - UUID of the user.
   * @param data - Partial data to update.
   * @returns The updated user record.
   */
  async updateById(id: string, data: Partial<any>) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Soft deletes a user by setting isActive to false and tracking metadata.
   * The `deletedBy` field is injected by the AuditInterceptor.
   * @param id - UUID of the user to delete.
   * @param deletedBy - ID of the user performing the deletion.
   * @returns The updated (deactivated) user record.
   */
  async softDelete(id: string, deletedBy: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
        deletedBy,
      },
    });
  }

  /**
   * Finds an active user by email.
   * @param email - User's email address.
   * @returns The user record if found and active.
   */
  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email, isActive: true },
    });
  }

  /**
   * Finds an active user by username.
   * @param username - User's username.
   * @returns The user record if found and active.
   */
  async findByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: { username, isActive: true },
    });
  }

  /**
   * Retrieves a paginated list of users from the database based on the provided criteria.
   * 
   * @param criteria - An instance of `UserCriteria` containing filtering and pagination options.
   * @returns data users
   */
  async findWithCriteria({ where, skip, take, orderBy }) {
    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({ where, skip, take, orderBy }),
      this.prisma.user.count({ where }),
    ]);

    const sanitized = users.map(({ password, ...rest }) => rest);
    return { data: sanitized, total };
  }

}
