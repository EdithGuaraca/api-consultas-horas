import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiConsultoriaGService } from './api-consultoria-g.service';

@Controller('api-consultoria-g')
export class ApiConsultoriaGController {
  constructor(private readonly apiConsultoriaGService: ApiConsultoriaGService) { }

}
