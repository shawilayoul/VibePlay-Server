import { Module } from '@nestjs/common';
import { PlayListTrackService } from './play-list-track.service';
import { PlayListTrackController } from './play-list-track.controller';
import { PrismaService } from 'src/prisma/prismaService';
import { PlaylistService } from 'src/playlist/playlist.service';
@Module({
  providers: [PlayListTrackService, PrismaService, PlaylistService],
  controllers: [PlayListTrackController],
})
export class PlayListTrackModule {}
