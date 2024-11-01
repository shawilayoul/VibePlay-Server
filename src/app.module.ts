import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackModule } from './track/track.module';
import { UserModule } from './user/user.module';
import { PlaylistModule } from './playlist/playlist.module';
import { ConfigModule } from '@nestjs/config';
import { PodcastModule } from './podcast/podcast.module';
import { EpisodeModule } from './episode/episode.module';
import { ArtistsModule } from './artists/artists.module';
import { ArtistTracksModule } from './artist-tracks/artist-tracks.module';
import { TrendingTrackModule } from './trending-track/trending-track.module';
import { PlayListTrackModule } from './play-list-track/play-list-track.module';


@Module({
  imports: [
    TrackModule,
    UserModule,
    PlaylistModule,
    ConfigModule.forRoot({
      isGlobal: true, // makes the config available globally
    }),
    PodcastModule,
    EpisodeModule,
    ArtistsModule,
    ArtistTracksModule,
    TrendingTrackModule,
    PlayListTrackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
