import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { Podcast } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreatePodcastDto } from 'src/Dto/playlistDto';

@Controller('podcast')
export class PodcastController {
  constructor(
    private readonly podcastService: PodcastService,
    private readonly firebaseService: FirebaseService,
  ) {}

  //create Podcast
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async createPodcast(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data: CreatePodcastDto,
  ) {
    let artworkUrl: string | null = null;
    try {
      if (!files || files.length === 0) {
        throw new Error('No files uploaded');
      }
      const promises = files.map(async (file) => {
        const urls: string = await this.firebaseService.uploadFile(
          file,
          'podcasts',
        );

        // Check if the file is of a supported image type (e.g., png, jpg, jpeg)
        const supportedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

        if (supportedImageTypes.includes(file.mimetype.toLowerCase())) {
          artworkUrl = urls; // Assign the URL if it's a supported image type
        }
      });
      await Promise.all(promises);

      return this.podcastService.create({
        title: data.title,
        description: data.description,
        artwork: artworkUrl,
      });
    } catch (error) {
      console.log('Error during track upload:', error);
      throw new Error('Failed to upload track: ' + error);
    }
  }

  //get all
  @Get()
  findAll(): Promise<Podcast[]> {
    return this.podcastService.findAll();
  }

  //get podcast with episodes
  @Get('podcastEpisode/:podcastId')
  async getPodcasttWithEpisodes(@Param('podcastId') podcastId: string) {
    return this.podcastService.getPoscastWithEpisode(podcastId);
  }

  //find one
  @Get(':id')
  findOne(@Param(':id') id: string): Promise<Podcast> {
    return this.podcastService.findOne(id);
  }
}
