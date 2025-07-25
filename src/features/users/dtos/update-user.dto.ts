import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsDate,
  Length,
} from 'class-validator';
import { Role, DocumentType } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(6, 250)
  password?: string;

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
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  // Audit
  @IsOptional()
  @IsUUID()
  updatedBy?: string;

  // Audit
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;
}
