import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProcessApiN8nService } from './process-api-n8n.service';

@Controller('process-api-n8n')
export class ProcessApiN8nController {
  constructor(private readonly _processApiN8nService: ProcessApiN8nService) { }


  @Post("/enviar-alerta")
  async postMessageByUser() {
    return await this._processApiN8nService.postMessageBack();
  }


}
