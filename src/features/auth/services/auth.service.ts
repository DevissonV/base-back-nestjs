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
   * @returns The authenticated user if credentials are valid and active.
   * @throws UnauthorizedException if credentials are invalid or user is inactive.
   * @throws InternalServerErrorException for unexpected validation errors.
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
      if (error instanceof UnauthorizedException) throw error;
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
    await this.usersRepo.updateById(user.id, { lastLogin: new Date() });
    return this.generateTokens(user);
  }

  /**
   * Validates a refresh token and issues new access and refresh tokens.
   * @param refreshToken - The refresh token to verify.
   * @returns An object containing new accessToken and refreshToken.
   * @throws UnauthorizedException if the token is invalid, expired, or user is inactive.
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const user = await this.usersRepo.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid user');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Generates both access and refresh tokens using the user payload.
   * @param user - The user for whom to generate tokens.
   * @returns An object containing accessToken and refreshToken.
   */
  private generateTokens(user: User): { accessToken: string; refreshToken: string } {
    const jwtConfig = this.configService.get('jwt');
    const payload = this.buildTokenPayload(user);

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConfig.secret,
      expiresIn: jwtConfig.accessExpiration,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConfig.refreshSecret,
      expiresIn: jwtConfig.refreshExpiration,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Builds the JWT payload from the given user data.
   * @param user - The user whose properties will be used in the token.
   * @returns The object to embed as the payload in JWTs.
   */
  private buildTokenPayload(user: User) {
    return {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      documentId: user.documentId,
      documentType: user.documentType,
    };
  }
}
