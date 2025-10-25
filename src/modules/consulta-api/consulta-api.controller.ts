import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConsultaApiService } from './consulta-api.service';

@Controller('consulta-api')
export class ConsultaApiController {
  constructor(private readonly consultaApiService: ConsultaApiService) { }

  @Get("/horas")
  async consultaApi() {
    return await this.consultaApiService.consultarHoras();
  }

}
