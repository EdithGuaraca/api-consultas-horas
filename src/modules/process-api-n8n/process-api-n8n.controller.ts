import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProcessApiN8nService } from './process-api-n8n.service';
import { GetUsuarioByNombreDto } from './dto/process-api.dto';

@Controller('process-api-n8n')
export class ProcessApiN8nController {
  constructor(private readonly _processApiN8nService: ProcessApiN8nService) { }


  @Post("/enviar-alerta")
  async postMessageByUser() {
    return await this._processApiN8nService.postMessageBack();
  }

  @Get('/obtener-usuario')
  async getUsuarios(@Query() params: GetUsuarioByNombreDto) {
    return await this._processApiN8nService.getUsuarioByNombre(params.nombre);
  }

  @Get('/obtener-proyecto')
  async getProyectos(@Query() params: GetUsuarioByNombreDto) {
    return await this._processApiN8nService.getProyectosByNombre(params.nombre);
  }



}
