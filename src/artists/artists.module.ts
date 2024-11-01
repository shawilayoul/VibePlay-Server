import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { PrismaService } from 'src/prisma/prismaService';
import { ArtistsController } from './artists.controller';

@Module({
  providers: [ArtistsService, PrismaService],
  controllers: [ArtistsController],
})
export class ArtistsModule {}
