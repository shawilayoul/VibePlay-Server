import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaService';
import { Playlist } from '@prisma/client';

@Injectable()
export class PlaylistService {
  constructor(private prisma: PrismaService) {}

  // create playlist
  async createPlaylist(data: {
    title: string;
    description: string;
    artwork: string;
  }): Promise<Playlist> {
    return this.prisma.playlist.create({ data });
  }
  //get user playlist
  async getPlaylists() {
    return this.prisma.playlist.findMany();
  }
  // get list with tracks
  async getisttWithTrack(playlistId: string) {
    //check if the playlist exists
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });
    if (!playlistId) {
      throw new Error(`podcast with ID ${playlist} not found`);
    }

    // fetch playlist a long with its ttrack
    const playlisttWithTracks = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
      include: {
        playlistTracks: true,
      },
    });
    return playlisttWithTracks;
  }
}
