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
  phone_number?: string;

  @IsOptional()
  @IsString()
  document_id?: string;

  @IsOptional()
  @IsEnum(DocumentType)
  document_type?: DocumentType;

  // Audit
  @IsOptional()
  @IsUUID()
  createdBy?: string;

  // Audit
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;
}
