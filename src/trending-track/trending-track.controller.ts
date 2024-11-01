import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prismaService';
import { TrendingTrackService } from './trending-track.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TrendingTrack } from '@prisma/client';

@Controller('trending-track')
export class TrendingTrackController {
  constructor(
    private readonly trendingTrackService: TrendingTrackService,
    private readonly firebaseService: FirebaseService,
    private prisma: PrismaService,
  ) {}

  // create a track
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async createTrack(
    @UploadedFiles() files: Express.Multer.File[],
    @Body()
    data: {
      title: string;
      artist: string;
    },
  ) {
    let artworkUrl: string | null = null;
    let songUrl: string | null = null;
    try {
      if (!files || files.length === 0) {
        throw new Error('No files uploaded');
      }
      const promises = files.map(async (file) => {
        const urls: string = await this.firebaseService.uploadFile(
          file,
          'trendingTracks',
        );
        console.log('Uploaded file URL:', urls); // Log the URL
        // Check if the current file is artwork

        // Check if the file is of a supported image type (e.g., png, jpg, jpeg)
        const supportedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

        if (supportedImageTypes.includes(file.mimetype.toLowerCase())) {
          artworkUrl = urls; // Assign the URL if it's a supported image type
        } else if (
          file.mimetype === 'audio/mpeg' ||
          file.mimetype === 'audio/mp3'
        ) {
          songUrl = urls; // Assign the URL if it's an audio file
        }
      });
      await Promise.all(promises);

      // Ensure URLs are not null
      if (!songUrl) {
        throw new Error('No song file uploaded');
      }
      return this.trendingTrackService.createTrack({
        title: data.title,
        artist: data.artist,
        url: songUrl, // URL from the uploaded file
        artwork: artworkUrl,
      });
    } catch (error) {
      console.log('Error during track upload:', error);
      throw new Error('Failed to upload track: ' + error);
    }
  }

  // get all tracks
  @Get()
  async getAllTracks() {
    try {
      return await this.trendingTrackService.getAllTracks();
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }
  }
  //get track by id
  @Get(':id')
  async getTrackById(@Param('id') id: string) {
    return this.trendingTrackService.getTrackById(id);
  }

  // update a track
  @Put(':id')
  async updateTrack(
    @Param('id') id: string,
    @Body() data: Partial<TrendingTrack>,
  ) {
    return this.trendingTrackService.updateTrack(id, data);
  }

  // delete a track
  @Delete(':id')
  async deleteTrack(@Param('id') id: string) {
    return this.trendingTrackService.deleteTrack(id);
  }
}
