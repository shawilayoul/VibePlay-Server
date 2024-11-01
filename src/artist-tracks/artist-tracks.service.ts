import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaService';

@Injectable()
export class ArtistTracksService {
  constructor(private readonly prisma: PrismaService) {}

  // create artist track
  async createTrack(data: {
    title: string;
    artist: string;
    url: string;
    artwork?: string | null; // Artwork can be null if not provided
    artistId: string;
  }) {
    return this.prisma.artistTrack.create({
      data: {
        title: data.title,
        artist: data.artist,
        url: data.url,
        artwork: data.artwork !== null ? data.artwork : undefined, // This can be null if no artwork is provided
        artistId: data.artistId,
      },
    });
  }
}
