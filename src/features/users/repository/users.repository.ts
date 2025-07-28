import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';
import { BaseRepository } from '@shared/database/base.repository';
import { User } from '@prisma/client';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(protected readonly prisma: PrismaService) {
    super();
  }

  protected get model() {
    return this.prisma.user;
  }

  /**
   * Finds an active user by their email address.
   *
   * @param email - The email address of the user to find.
   * @returns A promise that resolves to the user object if found, or `null` if no active user with the given email exists.
   */
  async findByEmail(email: string) {
    return this.model.findFirst({
      where: { email, isActive: true },
    });
  }

  /**
   * Finds an active user by their username.
   *
   * @param username - The username of the user to find.
   * @returns A promise that resolves to the user object if found, or `null` if no active user with the given username exists.
   */
  async findByUsername(username: string) {
    return this.model.findFirst({
      where: { username, isActive: true },
    });
  }
}
