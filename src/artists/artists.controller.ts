import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Artist } from '@prisma/client';

@Controller('artists')
export class ArtistsController {
  constructor(
    private readonly artistsService: ArtistsService,
    private readonly firebaseService: FirebaseService,
  ) {}

  // create artits
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async createArtist(
    @UploadedFiles() files: Express.Multer.File[],
    @Body()
    data: {
      name: string;
    },
  ) {
    let bioUrl: string | null = null;
    try {
      if (!files || files.length === 0) {
        throw new Error('No files uploaded');
      }
      const promises = files.map(async (file) => {
        const urls: string = await this.firebaseService.uploadFile(
          file,
          'artists',
        );
        // Check if the file is of a supported image type (e.g., png, jpg, jpeg)
        const supportedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

        if (supportedImageTypes.includes(file.mimetype.toLowerCase())) {
          bioUrl = urls; // Assign the URL if it's a supported image type
        }
      });
      await Promise.all(promises);

      // Ensure URLs are not null
      if (!bioUrl) {
        throw new Error('No artistbio file uploaded');
      }

      return this.artistsService.createArtist({
        name: data.name,
        bio: bioUrl, // URL from the uploaded file
      });
    } catch (error) {
      console.log('Error during artist info upload:', error);
      throw new Error('Failed to upload artist info: ' + error);
    }
  }

  //get artist tracks
  @Get('artistTracks/:artistId')
  async getartistTracks(@Param('artistId') artistId: string) {
    return this.artistsService.getArtistTracks(artistId);
  }

  // get all artis
  @Get()
  async getAllArtists(): Promise<Artist[]> {
    return this.artistsService.getAllArtists();
  }
}
