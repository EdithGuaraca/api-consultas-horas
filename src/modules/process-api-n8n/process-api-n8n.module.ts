import { Module } from '@nestjs/common';
import { ProcessApiN8nService } from './process-api-n8n.service';
import { ProcessApiN8nController } from './process-api-n8n.controller';
import { SlackApiModule } from '../slack/slack-api/slack-api.module';
import { HttpModule } from '@nestjs/axios';
import { ApiConsultoriaGModule } from '../api-consultoria-g/api-consultoria-g.module';
import { ConsultaApiModule } from '../consulta-api-cg/consulta-api.module';

@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 3,
  }),
    SlackApiModule,
    ApiConsultoriaGModule,
    ConsultaApiModule

  ],
  controllers: [ProcessApiN8nController],
  providers: [ProcessApiN8nService],
})
export class ProcessApiN8nModule { }
