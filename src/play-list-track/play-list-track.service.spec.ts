import { Test, TestingModule } from '@nestjs/testing';
import { PlayListTrackService } from './play-list-track.service';

describe('PlayListTrackService', () => {
  let service: PlayListTrackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayListTrackService],
    }).compile();

    service = module.get<PlayListTrackService>(PlayListTrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
