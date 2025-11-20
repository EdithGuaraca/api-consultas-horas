import { Test, TestingModule } from '@nestjs/testing';
import { ProcessApiSlackController } from './process-api-slack.controller';
import { ProcessApiSlackService } from './process-api-slack.service';

describe('ProcessApiSlackController', () => {
  let controller: ProcessApiSlackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessApiSlackController],
      providers: [ProcessApiSlackService],
    }).compile();

    controller = module.get<ProcessApiSlackController>(ProcessApiSlackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
