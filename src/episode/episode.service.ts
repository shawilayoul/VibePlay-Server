import { Injectable } from '@nestjs/common';
import { Episode } from '@prisma/client';
import { PrismaService } from 'src/prisma/prismaService';

@Injectable()
export class EpisodeService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    artist: string;
    description: string;
    duration: number;
    artwork: string;
    url: string;
    podcastId: string;
  }): Promise<Episode> {
    const newEpisode = this.prisma.episode.create({
      data: {
        title: data.title,
        artist: data.artist,
        description: data.description,
        duration: data.duration,
        artwork: data.artwork,
        url: data.url,
        podcastId: data.podcastId,
      },
    });
    return newEpisode;
  }
  //find all episode
  async findAll(): Promise<Episode[]> {
    return this.prisma.episode.findMany();
  }

  // find one
  async findOne(id: string): Promise<Episode> {
    return this.prisma.episode.findUnique({ where: { id } });
  }

  // update episode
  async update(
    id: string,
    data: { title?: string; description?: string; artwork: string },
  ): Promise<Episode> {
    return this.prisma.episode.update({ where: { id }, data });
  }
}
