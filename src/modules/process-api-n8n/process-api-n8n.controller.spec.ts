import { Test, TestingModule } from '@nestjs/testing';
import { ProcessApiN8nController } from './process-api-n8n.controller';
import { ProcessApiN8nService } from './process-api-n8n.service';

describe('ProcessApiN8nController', () => {
  let controller: ProcessApiN8nController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessApiN8nController],
      providers: [ProcessApiN8nService],
    }).compile();

    controller = module.get<ProcessApiN8nController>(ProcessApiN8nController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
