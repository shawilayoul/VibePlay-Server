import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PlayListTrackService } from './play-list-track.service';

@Controller('play-list-track')
export class PlayListTrackController {
  constructor(
    private readonly playListTrackService: PlayListTrackService,
    private readonly firebaseService: FirebaseService,
  ) {}
  //create playlistTrack
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body()
    data: {
      title: string;
      artist: string;
      playlistId: string;
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
          'playlistTracks',
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

      return this.playListTrackService.create({
        title: data.title,
        url: trackUrl, // URL from the uploaded file
        artwork: artworkUrl,
        artist: data.artist,
        playlistId: data.playlistId,
      });
    } catch (error) {
      console.log('Error during track upload:', error);
      throw new Error('Failed to upload track: ' + error);
    }
  }
}
