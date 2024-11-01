import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ArtistTracksService } from './artist-tracks.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('artist-tracks')
export class ArtistTracksController {
  constructor(
    private readonly artistTracksService: ArtistTracksService,
    private readonly firebaseService: FirebaseService,
  ) {}
  //create artist tracks
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body()
    data: {
      title: string;
      artist: string;
      artistId: string;
    },
  ) {
    let artworkUrl: string | null = null;
    let trackUrl: string | null = null;
    try {
      if (!files || files.length === 0) {
        throw new Error('No files uploaded');
      }
      const promises = files.map(async (file) => {
        const urls: string = await this.firebaseService.uploadFile(
          file,
          'artistTracks',
        );
        // Check if the file is of a supported image type (e.g., png, jpg, jpeg)
        const supportedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

        if (supportedImageTypes.includes(file.mimetype.toLowerCase())) {
          artworkUrl = urls; // Assign the URL if it's a supported image type
        } else if (
          file.mimetype === 'audio/mpeg' ||
          file.mimetype === 'audio/mp3'
        ) {
          trackUrl = urls; // Assign the URL if it's an audio file
        }
      });
      await Promise.all(promises);

      // Ensure URLs are not null
      if (!trackUrl) {
        throw new Error('No track file uploaded');
      }

      return this.artistTracksService.createTrack({
        title: data.title,
        artist: data.artist,
        artistId: data.artistId,
        url: trackUrl,
        artwork: artworkUrl,
      });
    } catch (error) {
      console.log('Error during track upload:', error);
      throw new Error('Failed to upload track: ' + error);
    }
  }
}
