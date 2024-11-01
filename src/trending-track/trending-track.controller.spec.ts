import { Test, TestingModule } from '@nestjs/testing';
import { TrendingTrackController } from './trending-track.controller';

describe('TrendingTrackController', () => {
  let controller: TrendingTrackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrendingTrackController],
    }).compile();

    controller = module.get<TrendingTrackController>(TrendingTrackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
