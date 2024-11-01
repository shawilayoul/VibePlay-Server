import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaService';
import { Artist } from '@prisma/client';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  async createArtist(data: { name: string; bio?: string }): Promise<Artist> {
    return this.prisma.artist.create({ data });
  }

  // get artist tracks
  async getArtistTracks(artistId: string) {
    //check if the playlist exists
    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
    });
    if (!artist) {
      throw new Error(`artist with ID ${artistId} not found`);
    }

    // fetch artist tracks
    const artistTracks = await this.prisma.artist.findUnique({
      where: { id: artistId },
      include: {
        artistTracks: true,
      },
    });
    return artistTracks;
  }

  async getAllArtists(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async getArtistById(id: string): Promise<Artist> {
    return this.prisma.artist.findUnique({ where: { id } });
  }

  async updateArtist(
    id: string,
    data: { name?: string; bio?: string },
  ): Promise<Artist> {
    return this.prisma.artist.update({ where: { id }, data });
  }

  async deleteArtist(id: string): Promise<Artist> {
    return this.prisma.artist.delete({ where: { id } });
  }
}
