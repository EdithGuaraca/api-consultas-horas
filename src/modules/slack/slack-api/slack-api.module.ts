import { Module } from '@nestjs/common';
import { SlackApiService } from './slack-api.service';
import { SlackApiController } from './slack-api.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),],
  controllers: [SlackApiController],
  providers: [SlackApiService],
  exports: [SlackApiService]
})
export class SlackApiModule { }
