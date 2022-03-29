import { Test, TestingModule } from '@nestjs/testing';
import { UsersTranscriptService } from './users-transcript.service';

describe('UsersTranscriptService', () => {
  let service: UsersTranscriptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersTranscriptService],
    }).compile();

    service = module.get<UsersTranscriptService>(UsersTranscriptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
