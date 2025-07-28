import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Role, DocumentType } from '@prisma/client';
import { BaseSearchDto } from '@shared/dtos/base-search.dto';
import { TransformToBoolean } from '@shared/utils/transform-boolean.util';

export class SearchUsersDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  documentId?: string;

  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  isActive?: string | boolean;
}
