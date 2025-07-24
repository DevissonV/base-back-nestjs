import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@shared/config/configuration';
import { validationSchema } from '@shared/config/envs';
import { PrismaService } from '@shared/prisma/prisma.service';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
