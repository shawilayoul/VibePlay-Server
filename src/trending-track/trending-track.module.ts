import { Module } from '@nestjs/common';
import { TrendingTrackService } from './trending-track.service';
import { TrendingTrackController } from './trending-track.controller';
import { PrismaService } from 'src/prisma/prismaService';
@Module({
  providers: [TrendingTrackService, PrismaService],
  controllers: [TrendingTrackController],
})
export class TrendingTrackModule {}
