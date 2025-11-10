import { Test, TestingModule } from '@nestjs/testing';
import { SlackApiController } from './slack-api.controller';
import { SlackApiService } from './slack-api.service';

describe('SlackApiController', () => {
  let controller: SlackApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlackApiController],
      providers: [SlackApiService],
    }).compile();

    controller = module.get<SlackApiController>(SlackApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
