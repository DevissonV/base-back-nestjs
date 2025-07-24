import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticates a user and returns JWT tokens if credentials are valid.
   * @param dto - User credentials (email and password).
   * @returns Access and refresh tokens, or an error if authentication fails.
   */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  
  /**
   * Issues new access and refresh tokens using a valid refresh token.
   * @param dto - Object containing the refresh token to validate.
   * @returns A structured response with new tokens and metadata.
   */
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return await this.authService.refreshToken(dto.refreshToken);
  }

}
