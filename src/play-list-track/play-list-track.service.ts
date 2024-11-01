import { Injectable } from '@nestjs/common';
import { PlaylistTrack } from '@prisma/client';
import { PrismaService } from 'src/prisma/prismaService';

@Injectable()
export class PlayListTrackService {
  constructor(private prisma: PrismaService) {}
  async create(data: {
    title: string;
    artist: string;
    artwork: string;
    url: string;
    playlistId: string;
  }): Promise<PlaylistTrack> {
    const newEpisode = this.prisma.playlistTrack.create({
      data: {
        title: data.title,
        artist: data.artist,
        artwork: data.artwork,
        url: data.url,
        playlistId: data.playlistId,
      },
    });
    return newEpisode;
  }

  // get playlist with tracks
  async getisttWithTrack(playlistId: string) {
    //check if the playlist exists
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });
    if (!playlistId) {
      throw new Error(`podcast with ID ${playlist} not found`);
    }

    // fetch playlist a long with its track
    const playlisttWithTracks = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
      include: {
        playlistTracks: true,
      },
    });
    return playlisttWithTracks;
  }
}
