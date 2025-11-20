import { Module } from '@nestjs/common';
import { ApiConsultoriaGService } from './api-consultoria-g.service';
import { ApiConsultoriaGController } from './api-consultoria-g.controller';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
    CommonModule

  ],
  controllers: [ApiConsultoriaGController],
  providers: [ApiConsultoriaGService],
  exports: [ApiConsultoriaGService]
})
export class ApiConsultoriaGModule { }
