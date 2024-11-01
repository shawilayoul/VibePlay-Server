import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prismaService';
@Module({
  imports: [
    JwtModule.register({
      secret: 'shawil12!', // Use an environment variable for production
      signOptions: { expiresIn: '300s' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
