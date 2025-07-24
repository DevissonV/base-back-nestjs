import { Role, DocumentType } from '@prisma/client';

export class UserEntity {
  id: string;
  username: string;
  email: string;
  role: Role;
  phoneNumber?: string;
  documentId?: string;
  documentType?: DocumentType;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
  lastLogin?: Date;
}
