import { Test, TestingModule } from '@nestjs/testing';
import { CollectiblesController } from './collectibles.controller';
import { CollectiblesService } from './collectibles.service';

describe('CollectiblesController', () => {
  let controller: CollectiblesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectiblesController],
      providers: [CollectiblesService],
    }).compile();

    controller = module.get<CollectiblesController>(CollectiblesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
