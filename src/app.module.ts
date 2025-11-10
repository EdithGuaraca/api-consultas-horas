import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsultaApiModule } from './modules/consulta-api/consulta-api.module';
import { SessionModule } from './modules/db/session/session.module';
import { DatabaseModule } from './configuration/database/postgres/database.module';
import { SlackApiModule } from './modules/slack/slack-api/slack-api.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${(process.env.NODE_ENV || 'development').trim()}.env`,
      isGlobal: true,
    }),
    ConsultaApiModule,
    SessionModule,
    DatabaseModule,
    SlackApiModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
