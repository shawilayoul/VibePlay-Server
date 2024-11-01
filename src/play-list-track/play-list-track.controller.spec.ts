import { Test, TestingModule } from '@nestjs/testing';
import { PlayListTrackController } from './play-list-track.controller';

describe('PlayListTrackController', () => {
  let controller: PlayListTrackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayListTrackController],
    }).compile();

    controller = module.get<PlayListTrackController>(PlayListTrackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
