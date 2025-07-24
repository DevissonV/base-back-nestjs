import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { hashPassword } from '@shared/utils/hash.util';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(input: CreateUserDto): Promise<UserEntity> {
    try {
      const hashedPassword = await hashPassword(input.password);

      const user = await this.usersRepository.createUser({
        ...input,
        password: hashedPassword,
        createdBy: 'system',
      });

      return this.mapToEntity(user);
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async getAllUsers(): Promise<UserEntity[]> {
    try {
      const users = await this.usersRepository.findAll();
      return users.map((user) => this.mapToEntity(user));
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving users');
    }
  }

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

  async deleteUser(id: string): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findById(id);
      if (!user) throw new NotFoundException('User not found');

      const deleted = await this.usersRepository.softDelete(id, 'system');
      return this.mapToEntity(deleted);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  private mapToEntity(user: any): UserEntity {
    const { password, ...rest } = user;
    return rest;
  }
}
