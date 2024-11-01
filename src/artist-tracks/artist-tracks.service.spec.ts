import { Test, TestingModule } from '@nestjs/testing';
import { ArtistTracksService } from './artist-tracks.service';

describe('ArtistTracksService', () => {
  let service: ArtistTracksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtistTracksService],
    }).compile();

    service = module.get<ArtistTracksService>(ArtistTracksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
