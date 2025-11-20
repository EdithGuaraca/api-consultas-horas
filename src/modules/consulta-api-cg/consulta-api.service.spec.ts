import { Test, TestingModule } from '@nestjs/testing';
import { ConsultaApiService } from './consulta-api.service';

describe('ConsultaApiService', () => {
  let service: ConsultaApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsultaApiService],
    }).compile();

    service = module.get<ConsultaApiService>(ConsultaApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
