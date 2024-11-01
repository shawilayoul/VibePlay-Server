import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistDto } from 'src/Dto/playlistDto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/firebase/firebase.service';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private playlistService: PlaylistService,
    private readonly firebaseService: FirebaseService,
  ) {}

  //create Podcast
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async createPodcast(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data: PlaylistDto,
  ) {
    let artworkUrl: string | null = null;
    try {
      if (!files || files.length === 0) {
        throw new Error('No files uploaded');
      }
      const promises = files.map(async (file) => {
        const urls: string = await this.firebaseService.uploadFile(
          file,
          'playlists',
        );

        // Check if the file is of a supported image type (e.g., png, jpg, jpeg)
        const supportedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

        if (supportedImageTypes.includes(file.mimetype.toLowerCase())) {
          artworkUrl = urls; // Assign the URL if it's a supported image type
        }
      });
      await Promise.all(promises);

      return this.playlistService.createPlaylist({
        title: data.title,
        description: data.description,
        artwork: artworkUrl,
      });
    } catch (error) {
      console.log('Error during track upload:', error);
      throw new Error('Failed to upload track: ' + error);
    }
  }

  @Get()
  async getPlaylists() {
    return this.playlistService.getPlaylists();
  }
  //get list  with tracks
  @Get('listTracks/:playlistId')
  async getPlaylisttWithTrackss(@Param('playlistId') playlistId: string) {
    return this.playlistService.getisttWithTrack(playlistId);
  }
}
