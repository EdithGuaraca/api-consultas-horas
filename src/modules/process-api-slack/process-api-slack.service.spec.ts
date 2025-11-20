import { Test, TestingModule } from '@nestjs/testing';
import { ProcessApiSlackService } from './process-api-slack.service';

describe('ProcessApiSlackService', () => {
  let service: ProcessApiSlackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessApiSlackService],
    }).compile();

    service = module.get<ProcessApiSlackService>(ProcessApiSlackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
