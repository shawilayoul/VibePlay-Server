import { Module } from '@nestjs/common';
import { PodcastController } from './podcast.controller';
import { PodcastService } from './podcast.service';
import { PrismaService } from 'src/prisma/prismaService';

@Module({
  providers: [PodcastService, PrismaService],
  controllers: [PodcastController],
})
export class PodcastModule {}
