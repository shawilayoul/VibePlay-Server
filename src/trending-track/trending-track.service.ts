import { Injectable } from '@nestjs/common';
import { TrendingTrack } from '@prisma/client';
import { PrismaService } from 'src/prisma/prismaService';

@Injectable()
export class TrendingTrackService {
  constructor(private prisma: PrismaService) {}

  async createTrack(data: {
    title: string;
    artist: string;
    url: string;
    artwork?: string | null; // Artwork can be null if not provided
  }) {
    return this.prisma.trendingTrack.create({
      data: {
        title: data.title,
        artist: data.artist,
        url: data.url,
        artwork: data.artwork !== null ? data.artwork : undefined, // This can be null if no artwork is provided
      },
    });
  }

  async getAllTracks() {
    try {
      return await this.prisma.trendingTrack.findMany();
    } catch (error) {
      console.error('Error retrieving tracks:', error);
      throw new Error('Failed to retrieve tracks'); // You can customize this as needed
    }
  }

  //get a track by id
  async getTrackById(id: string) {
    return this.prisma.trendingTrack.findUnique({ where: { id } });
  }
  // update a track
  async updateTrack(
    id: string,
    data: Partial<TrendingTrack>,
  ): Promise<TrendingTrack> {
    return this.prisma.trendingTrack.update({ where: { id }, data });
  }

  // delete a track
  async deleteTrack(id: string) {
    return this.prisma.trendingTrack.delete({ where: { id } });
  }
}
