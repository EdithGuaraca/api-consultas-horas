import { Test, TestingModule } from '@nestjs/testing';
import { ApiConsultoriaGService } from './api-consultoria-g.service';

describe('ApiConsultoriaGService', () => {
  let service: ApiConsultoriaGService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiConsultoriaGService],
    }).compile();

    service = module.get<ApiConsultoriaGService>(ApiConsultoriaGService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
