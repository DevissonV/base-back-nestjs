import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '@features/users/repository/users.repository';
import { LoginDto } from '../dtos/login.dto';
import { comparePasswords } from '@shared/utils/hash.util';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Validates user credentials by checking email/username and password.
   * @param dto - Login credentials containing usernameOrEmail and password.
   * @returns The user if credentials are valid and active.
   * @throws UnauthorizedException if credentials are invalid or user is inactive.
   * @throws InternalServerErrorException for unexpected errors during validation.
   */
  async validateUser({ usernameOrEmail, password }: LoginDto): Promise<User> {
    try {
      const isEmail = usernameOrEmail.includes('@');
      const user = isEmail
        ? await this.usersRepo.findByEmail(usernameOrEmail)
        : await this.usersRepo.findByUsername(usernameOrEmail);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordValid = await comparePasswords(password, user.password);
      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error during validation');
    }
  }

  /**
   * Authenticates the user and returns signed JWT access and refresh tokens.
   * @param dto - Login credentials.
   * @returns An object containing accessToken and refreshToken.
   */
  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);

    await this.usersRepo.updateById(user.id, {
      lastLogin: new Date(),
    });

    const payload = { sub: user.id, role: user.role };

    const jwtConfig = this.configService.get('jwt');

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConfig.secret,
      expiresIn: jwtConfig.accessExpiration,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConfig.refreshSecret,
      expiresIn: jwtConfig.refreshExpiration,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}