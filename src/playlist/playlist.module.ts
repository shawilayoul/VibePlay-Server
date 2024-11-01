import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { PrismaService } from 'src/prisma/prismaService';
@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService, PrismaService],
})
export class PlaylistModule {}
