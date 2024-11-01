import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { PrismaService } from 'src/prisma/prismaService';
import { FirebaseModule } from 'src/firebase/firebase.module';
@Module({
  imports: [FirebaseModule],
  controllers: [TrackController],
  providers: [TrackService, PrismaService],
})
export class TrackModule {}
