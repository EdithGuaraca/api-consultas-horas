import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsultaApiModule } from './modules/consulta-api-cg/consulta-api.module';
import { SlackApiModule } from './modules/slack/slack-api/slack-api.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './modules/common/common.module';
import { ApiConsultoriaGModule } from './modules/api-consultoria-g/api-consultoria-g.module';
import { ProcessApiN8nModule } from './modules/process-api-n8n/process-api-n8n.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${(process.env.NODE_ENV || 'development').trim()}.env`,
      isGlobal: true,
    }),
    ConsultaApiModule,
    SlackApiModule,
    CommonModule,
    ApiConsultoriaGModule,
    ProcessApiN8nModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
