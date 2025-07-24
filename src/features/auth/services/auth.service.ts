import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '@features/users/repository/users.repository';
import { LoginDto } from '../dtos/login.dto';
import { comparePasswords } from '@shared/utils/hash.util';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}
  
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
  
  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    
    const payload = { sub: user.id, role: user.role };
    
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    });
    
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    });
    
    return {
      accessToken,
      refreshToken,
    };
  }
}
