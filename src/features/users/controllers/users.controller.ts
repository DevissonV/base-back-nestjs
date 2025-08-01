import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { JwtPayload } from '@features/auth/types/jwt-payload.interface';
import { Roles } from '@shared/decorators/roles.decorator';
import { RolesGuard } from '@shared/guards/roles.guard';
import { ROLES } from '@shared/constants/roles.enum';
import { SearchUsersDto } from '../dtos/search-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Returns the authenticated user's payload.
   * Accessible to any authenticated user regardless of role.
   * 
   * @param user - Extracted from JWT token.
   * @returns The user info from the token.
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.getById(user.sub);
  }

  /**
   * Creates a new user in the system.
   * 
   * @param dto - The data for the new user.
   * @returns The created user entity.
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  @Post()
  create(@Body() dto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createUser(dto);
  }

  /**
   * Retrieves all active users.
   * 
   * @returns A list of user entities.
   */
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN, ROLES.BODEGUERO, ROLES.VENDEDOR)
  findAll(@Query() dto: SearchUsersDto) {
    return this.usersService.getAllUsers(dto);
  }

  /**
   * Retrieves a user by their unique identifier.
   * 
   * @param id - UUID of the user.
   * @returns The user entity if found.
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN, ROLES.BODEGUERO, ROLES.VENDEDOR)
  @Get(':id')
  findById(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.getById(id);
  }

  /**
   * Updates the user with the given ID.
   * Only accessible to admin.
   * 
   * @param id - UUID of the user to update.
   * @param dto - Partial data to update.
   * @returns The updated user entity.
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserEntity> {
    return this.usersService.updateUser(id, dto);
  }

  /**
 * Soft-deletes a user by marking them as inactive.
 * Only accessible to admin.
 * 
 * @param id - UUID of the user to delete.
 * @param body - Includes audit fields injected by AuditInterceptor.
 * @returns The user entity after being deactivated.
 */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Body() body: { deletedBy: string }
  ): Promise<UserEntity> {
    return this.usersService.deleteUser(id, body);
  }
}
