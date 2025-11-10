import { Module } from '@nestjs/common';
import { SlackApiService } from './slack-api.service';
import { SlackApiController } from './slack-api.controller';
import { SessionModule } from 'src/modules/db/session/session.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [SessionModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),],
  controllers: [SlackApiController],
  providers: [SlackApiService],
})
export class SlackApiModule { }
