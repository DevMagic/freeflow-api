import { Test, TestingModule } from '@nestjs/testing';
import { CollectiblesService } from './collectibles.service';

describe('CollectiblesService', () => {
  let service: CollectiblesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectiblesService],
    }).compile();

    service = module.get<CollectiblesService>(CollectiblesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
