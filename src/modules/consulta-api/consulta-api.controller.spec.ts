import { Test, TestingModule } from '@nestjs/testing';
import { ConsultaApiController } from './consulta-api.controller';
import { ConsultaApiService } from './consulta-api.service';

describe('ConsultaApiController', () => {
  let controller: ConsultaApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultaApiController],
      providers: [ConsultaApiService],
    }).compile();

    controller = module.get<ConsultaApiController>(ConsultaApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
