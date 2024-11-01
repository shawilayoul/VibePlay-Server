import { Module } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { EpisodeController } from './episode.controller';
import { PrismaService } from 'src/prisma/prismaService';
import { FirebaseModule } from 'src/firebase/firebase.module';
@Module({
  imports: [FirebaseModule],
  providers: [EpisodeService, PrismaService],
  controllers: [EpisodeController],
})
export class EpisodeModule {}
