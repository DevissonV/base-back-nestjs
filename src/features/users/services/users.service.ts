import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { hashPassword } from '@shared/utils/hash.util';
import { UserEntity } from '../entities/user.entity';
import { SearchUsersDto } from '../dtos/search-user.dto';
import { CriteriaService } from '@shared/criteria/criteria.service';
import { handlePrismaError } from '@shared/utils/handle-prisma-error.util';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly criteriaService: CriteriaService,
  ) {}

  /**
   * Creates a new user in the system after hashing their password.
   *
   * @param input - Data required to create a new user.
   * @returns The created user entity, excluding sensitive fields like password.
   * @throws ConflictException if the email or username already exists (handled by `handlePrismaError`).
   */
  async createUser(input: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await hashPassword(input.password);
    try {
      const user = await this.usersRepository.create({
        ...input,
        password: hashedPassword,
      });
      return this.mapToEntity(user);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Retrieves a paginated and filtered list of users based on the given search DTO.
   *
   * @param dto - DTO containing filters and pagination settings.
   * @returns An object containing the matched users and total count.
   */
  async getAllUsers(dto: SearchUsersDto) {
    return this.criteriaService.getAll({
      dto,
      filterMap: {
        username: { column: 'username', operator: 'ILIKE' },
        email: { column: 'email', operator: 'ILIKE' },
        phoneNumber: { column: 'phoneNumber', operator: 'ILIKE' },
        role: { column: 'role', operator: '=' },
        documentId: { column: 'documentId', operator: 'ILIKE' },
        documentType: { column: 'documentType', operator: '=' },
        isActive: { column: 'isActive', operator: '=' },
      },
      repository: this.usersRepository,
    });
  }

  /**
   * Retrieves a user by their unique ID.
   *
   * @param id - UUID of the user to retrieve.
   * @returns The user entity.
   * @throws NotFoundException if no user with the provided ID is found.
   */
  async getById(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.mapToEntity(user);
  }

  /**
   * Updates an existing user by ID with the provided data.
   *
   * @param id - UUID of the user to update.
   * @param input - Partial data to update.
   * @returns The updated user entity.
   * @throws NotFoundException if the user does not exist.
   * @throws ConflictException if the updated fields conflict with existing records (e.g., unique fields).
   */
  async updateUser(id: string, input: UpdateUserDto): Promise<UserEntity> {
    await this.getById(id);
    try {
      const updated = await this.usersRepository.updateById(id, input);
      return this.mapToEntity(updated);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Soft deletes (deactivates) a user by marking them as inactive.
   *
   * @param id - UUID of the user to delete.
   * @param data - Audit metadata including `deletedBy` (from interceptor).
   * @returns The soft-deleted user entity.
   * @throws NotFoundException if the user does not exist.
   */
  async deleteUser(id: string, data: { deletedBy: string }): Promise<UserEntity> {
    await this.getById(id);
    try {
      const deleted = await this.usersRepository.softDelete(id, data.deletedBy);
      return this.mapToEntity(deleted);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Maps a raw user record from the database to a sanitized public-facing entity.
   *
   * @param user - Raw database record including all fields.
   * @returns The user entity with sensitive fields (e.g., password) excluded.
   */
  private mapToEntity(user: any): UserEntity {
    const { password, ...rest } = user;
    return rest;
  }
}
