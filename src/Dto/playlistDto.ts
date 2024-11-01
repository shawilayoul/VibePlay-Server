import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePodcastDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString()
  artwork?: string; // Optional if you might not have it at the start
}
export class CreateEpisodeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  artist: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString() // Ensure this is a string
  duration: string;

  @IsString()
  artwork: string;

  @IsString()
  url: string;

  @IsString()
  podcastId: string;
}

export class LikedTrackCreateInput {
  @IsString()
  userId: string;

  @IsString()
  trackId: string;

  @IsOptional()
  @IsString()
  artistTrackId?: string; // Optional field

  @IsOptional()
  @IsString()
  listTrackId: string; // Required field
}

export class PlaylistDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString()
  artwork?: string;
}

export class PodcastlistDto {
  name: string;
  userId: string;
  length: number | null;
  genre: string;
  descriptions: string;
  image: string;
  createdAt: Date;
}
