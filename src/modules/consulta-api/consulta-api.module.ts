import { Module } from '@nestjs/common';
import { ConsultaApiService } from './consulta-api.service';
import { ConsultaApiController } from './consulta-api.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),

  ],
  controllers: [ConsultaApiController],
  providers: [ConsultaApiService],
  exports: [ConsultaApiService]
})
export class ConsultaApiModule { }
