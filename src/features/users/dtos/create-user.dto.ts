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

export class CreateUserDto {
  @IsString()
  @Length(3, 50)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 250)
  password: string;

  @IsEnum(Role)
  role: Role;

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
  createdBy?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;
}

