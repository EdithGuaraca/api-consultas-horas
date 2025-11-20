import { Test, TestingModule } from '@nestjs/testing';
import { ProcessApiN8nService } from './process-api-n8n.service';

describe('ProcessApiN8nService', () => {
  let service: ProcessApiN8nService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessApiN8nService],
    }).compile();

    service = module.get<ProcessApiN8nService>(ProcessApiN8nService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
