import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { ConsultaApiService } from './consulta-api.service';
import { GetConsultaParams } from './dto/consulta-api.dto';
@UsePipes(ValidationPipe)
@Controller('consulta-api')
export class ConsultaApiController {
  constructor(
    private readonly consultaApiService: ConsultaApiService
  ) { }

  @Get("/horas")
  async consultaApi() {
    return await this.consultaApiService.consultarHoras();
  }

  @Get("/horasp")
  async consultaApiP(@Query() params: GetConsultaParams) {
    return await this.consultaApiService.consultarHorasParams(params);
  }

  @Get("/usuario/listado")
  async getUsuariosListado() {
    return await this.consultaApiService.getUsuariosActivos();
  }



}
