import { Injectable } from '@nestjs/common';
import { Podcast } from '@prisma/client';
import { PrismaService } from 'src/prisma/prismaService';

@Injectable()
export class PodcastService {
  constructor(private prisma: PrismaService) {}
  // create a podcast
  async create(data: {
    title: string;
    description: string;
    artwork: string;
  }): Promise<Podcast> {
    return this.prisma.podcast.create({ data });
  }

  //get all podcasts
  async findAll(): Promise<Podcast[]> {
    return this.prisma.podcast.findMany({
      include: { episodes: true },
    });
  }

  // get playlist with tracks
  async getPoscastWithEpisode(podcastId: string) {
    //check if the playlist exists
    const podcast = await this.prisma.podcast.findUnique({
      where: { id: podcastId },
    });
    if (!podcastId) {
      throw new Error(`podcast with ID ${podcast} not found`);
    }

    // fetch playlist a long with its ttrack
    const podcastWithEpisode = await this.prisma.podcast.findUnique({
      where: { id: podcastId },
      include: {
        episodes: true,
      },
    });
    return podcastWithEpisode;
  }
  // get one
  async findOne(id: string): Promise<Podcast> {
    return this.prisma.podcast.findUnique({ where: { id } });
  }
  // update a podcast
  async update(
    id: string,
    data: { title?: string; description?: string; artwork?: string },
  ): Promise<Podcast> {
    return this.prisma.podcast.update({ where: { id }, data });
  }
  //remove a podcast
  async remove(id: string): Promise<Podcast> {
    return this.prisma.podcast.delete({ where: { id } });
  }
}
