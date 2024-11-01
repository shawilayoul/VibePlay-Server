import { Module } from '@nestjs/common';
import { ArtistTracksService } from './artist-tracks.service';
import { ArtistTracksController } from './artist-tracks.controller';
import { PrismaService } from 'src/prisma/prismaService';
@Module({
  providers: [ArtistTracksService, PrismaService],
  controllers: [ArtistTracksController],
})
export class ArtistTracksModule {}
