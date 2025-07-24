import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}
  
  /**
  * Persists a new user in the database.
  * @param data - User data including hashed password and createdBy metadata.
  * @returns The created user record.
  */
  async createUser(data: CreateUserDto & { password: string; createdBy: string }) {
    return this.prisma.user.create({
      data: {
        ...data,
        createdAt: new Date(),
        isActive: true,
        createdBy: data.createdBy,
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
  * @param id - UUID of the user to delete.
  * @param deletedBy - UUID of the user performing the deletion.
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
  
  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email, isActive: true },
    });
  }
  
  async findByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: { username, isActive: true },
    });
  }
}
