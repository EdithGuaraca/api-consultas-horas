import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProcessApiSlackService } from './process-api-slack.service';

@Controller('process-api-slack')
export class ProcessApiSlackController {
  constructor(private readonly processApiSlackService: ProcessApiSlackService) { }


}
