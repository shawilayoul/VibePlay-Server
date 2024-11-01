import { Test, TestingModule } from '@nestjs/testing';
import { ArtistTracksController } from './artist-tracks.controller';

describe('ArtistTracksController', () => {
  let controller: ArtistTracksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistTracksController],
    }).compile();

    controller = module.get<ArtistTracksController>(ArtistTracksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
