import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { hashPassword } from '@shared/utils/hash.util';
import { UserEntity } from '../entities/user.entity';
import { SearchUsersDto } from '../dtos/search-user.dto';
import { CriteriaService } from '@shared/criteria/criteria.service';

@Injectable()
export class UsersService {
   constructor(
    private readonly usersRepository: UsersRepository,
    private readonly criteriaService: CriteriaService,
  ) {}

  /**
   * Creates a new user after hashing the password.
   * @param input - Data to create the user.
   * @returns The created user entity without the password.
   * @throws InternalServerErrorException if the creation fails.
   */
  async createUser(input: CreateUserDto): Promise<UserEntity> {
    try {
      const hashedPassword = await hashPassword(input.password);

      const user = await this.usersRepository.createUser({
        ...input,
        password: hashedPassword,
      });

      return this.mapToEntity(user);
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  /**
   * Retrieves all active users.
   * @returns A list of user entities.
   * @throws InternalServerErrorException if retrieval fails.
   */
  async getAllUsers(dto: SearchUsersDto) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving users');
    }
  }

  /**
   * Retrieves a user by ID.
   * @param id - UUID of the user.
   * @returns The user entity.
   * @throws NotFoundException if the user is not found.
   * @throws InternalServerErrorException if retrieval fails.
   */
  async getById(id: string): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.mapToEntity(user);
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving user');
    }
  }

  /**
   * Updates a user by ID.
   * @param id - UUID of the user.
   * @param input - Partial user data to update.
   * @returns The updated user entity.
   * @throws NotFoundException if the user is not found.
   * @throws InternalServerErrorException if the update fails.
   */
  async updateUser(id: string, input: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findById(id);
      if (!user) throw new NotFoundException('User not found');

      const updated = await this.usersRepository.updateById(id, input);
      return this.mapToEntity(updated);
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  /**
   * Soft deletes a user by ID.
   * @param id - UUID of the user.
   * @param data - Object containing deletedBy (injected by AuditInterceptor).
   * @returns The user entity after deactivation.
   * @throws NotFoundException if the user is not found.
   * @throws InternalServerErrorException if deletion fails.
   */
  async deleteUser(id: string, data: { deletedBy: string }): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findById(id);
      if (!user) throw new NotFoundException('User not found');

      const deleted = await this.usersRepository.softDelete(id, data.deletedBy);
      return this.mapToEntity(deleted);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  /**
   * Maps a full user model to a public-facing entity (excludes password).
   * @param user - Raw user record from the database.
   * @returns The sanitized user entity.
   */
  private mapToEntity(user: any): UserEntity {
    const { password, ...rest } = user;
    return rest;
  }
}
