import { Test, TestingModule } from '@nestjs/testing';
import { ApiConsultoriaGController } from './api-consultoria-g.controller';
import { ApiConsultoriaGService } from './api-consultoria-g.service';

describe('ApiConsultoriaGController', () => {
  let controller: ApiConsultoriaGController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiConsultoriaGController],
      providers: [ApiConsultoriaGService],
    }).compile();

    controller = module.get<ApiConsultoriaGController>(ApiConsultoriaGController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
