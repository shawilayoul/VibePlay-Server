import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaService';
import { Track } from '@prisma/client';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  // geting all tracks
  async getAllTracks() {
    try {
      return await this.prisma.track.findMany();
    } catch (error) {
      console.error('Error retrieving tracks:', error);
      throw new Error('Failed to retrieve tracks'); // You can customize this as needed
    }
  }
  // create a track

  async createTrack(data: {
    title: string;
    artist: string;
    url: string;
    artwork?: string | null; // Artwork can be null if not provided
  }) {
    return this.prisma.track.create({
      data: {
        title: data.title,
        artist: data.artist,
        url: data.url,
        artwork: data.artwork !== null ? data.artwork : undefined, // This can be null if no artwork is provided
      },
    });
  }

  //get a track by id
  async getTrackById(id: string) {
    return this.prisma.track.findUnique({ where: { id } });
  }
  // update a track
  async updateTrack(id: string, data: Partial<Track>): Promise<Track> {
    return this.prisma.track.update({ where: { id }, data });
  }

  // delete a track
  async deleteTrack(id: string) {
    return this.prisma.track.delete({ where: { id } });
  }
}
