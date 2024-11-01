import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { Episode } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateEpisodeDto } from 'src/Dto/playlistDto';

@Controller('episode')
export class EpisodeController {
  constructor(
    private readonly episodeService: EpisodeService,
    private readonly firebaseService: FirebaseService,
  ) {}

  //create Episode
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body()
    data: CreateEpisodeDto,
  ) {
    let artworkUrl: string | null = null;
    let episodeUrl: string | null = null;
    try {
      if (!files || files.length === 0) {
        throw new Error('No files uploaded');
      }
      const promises = files.map(async (file) => {
        const urls: string = await this.firebaseService.uploadFile(
          file,
          'episodes',
        );
        // Check if the file is of a supported image type (e.g., png, jpg, jpeg)
        const supportedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

        if (supportedImageTypes.includes(file.mimetype.toLowerCase())) {
          artworkUrl = urls; // Assign the URL if it's a supported image type
        } else if (
          file.mimetype === 'audio/mpeg' ||
          file.mimetype === 'audio/mp3'
        ) {
          episodeUrl = urls; // Assign the URL if it's an audio file
        }
      });
      await Promise.all(promises);

      // Ensure URLs are not null
      if (!episodeUrl) {
        throw new Error('No episode file uploaded');
      }

      const { duration } = data;

      // Ensure duration is an integer
      const durationInt = parseInt(duration, 10); // Convert duration to an integer
      if (isNaN(durationInt)) {
        throw new Error('Duration must be a valid number');
      }
      return this.episodeService.create({
        title: data.title,
        artist: data.artist,
        description: data.description,
        podcastId: data.podcastId,
        url: episodeUrl, // URL from the uploaded file
        artwork: artworkUrl,
        duration: durationInt,
      });
    } catch (error) {
      console.log('Error during track upload:', error);
      throw new Error('Failed to upload track: ' + error);
    }
  }
  //get all
  @Get()
  findAll(): Promise<Episode[]> {
    return this.episodeService.findAll();
  }

  //find one
  @Get(':id')
  findOne(@Param(':id') id: string): Promise<Episode> {
    return this.episodeService.findOne(id);
  }
}
