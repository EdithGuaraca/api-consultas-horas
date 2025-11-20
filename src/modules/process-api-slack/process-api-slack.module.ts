import { Module } from '@nestjs/common';
import { ProcessApiSlackService } from './process-api-slack.service';
import { ProcessApiSlackController } from './process-api-slack.controller';
import { SlackApiModule } from '../slack/slack-api/slack-api.module';

@Module({
  imports: [SlackApiModule],
  controllers: [ProcessApiSlackController],
  providers: [ProcessApiSlackService],
})
export class ProcessApiSlackModule { }
