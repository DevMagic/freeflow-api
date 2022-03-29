import { Test, TestingModule } from '@nestjs/testing';
import { UsersTranscriptController } from './users-transcript.controller';
import { UsersTranscriptService } from './users-transcript.service';

describe('UsersTranscriptController', () => {
  let controller: UsersTranscriptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersTranscriptController],
      providers: [UsersTranscriptService],
    }).compile();

    controller = module.get<UsersTranscriptController>(UsersTranscriptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
