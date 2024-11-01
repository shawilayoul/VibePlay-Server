import { Test, TestingModule } from '@nestjs/testing';
import { TrendingTrackService } from './trending-track.service';

describe('TrendingTrackService', () => {
  let service: TrendingTrackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrendingTrackService],
    }).compile();

    service = module.get<TrendingTrackService>(TrendingTrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
