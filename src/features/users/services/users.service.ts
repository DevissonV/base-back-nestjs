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

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly criteriaService: CriteriaService,
  ) {}

  /**
   * Creates a new user in the system after hashing the password.
   *
   * @param input - The DTO containing user creation data.
   * @returns The created user entity with sensitive fields removed.
   */
  async createUser(input: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await hashPassword(input.password);
    const user = await this.usersRepository.create({
      ...input,
      password: hashedPassword,
    });

    return this.mapToEntity(user);
  }

  /**
   * Retrieves users from the database based on search filters and pagination.
   *
   * @param dto - The DTO containing filters and pagination options.
   * @returns A paginated list of users matching the criteria.
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
   * Retrieves a single user by their unique ID.
   *
   * @param id - UUID of the user to retrieve.
   * @returns The user entity if found.
   * @throws NotFoundException if no user is found with the given ID.
   */
  async getById(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.mapToEntity(user);
  }

  /**
   * Updates a user's information by their unique ID.
   *
   * @param id - UUID of the user to update.
   * @param input - Partial user data to update.
   * @returns The updated user entity.
   * @throws NotFoundException if the user does not exist.
   */
  async updateUser(id: string, input: UpdateUserDto): Promise<UserEntity> {
    await this.getById(id);
    const updated = await this.usersRepository.updateById(id, input);
    return this.mapToEntity(updated);
  }

  /**
   * Performs a soft delete on a user, deactivating their account.
   *
   * @param id - UUID of the user to deactivate.
   * @param data - Object containing `deletedBy` (injected via interceptor).
   * @returns The deactivated user entity.
   * @throws NotFoundException if the user is not found.
   */
  async deleteUser(id: string, data: { deletedBy: string }): Promise<UserEntity> {
    await this.getById(id);
    const deleted = await this.usersRepository.softDelete(id, data.deletedBy);
    return this.mapToEntity(deleted);
  }

  /**
   * Transforms the full user model into a public-safe entity by excluding the password.
   *
   * @param user - The full database record of the user.
   * @returns A sanitized user entity.
   */
  private mapToEntity(user: any): UserEntity {
    const { password, ...rest } = user;
    return rest;
  }
}
