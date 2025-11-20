import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { HttpModule } from '@nestjs/axios';

@Module({

  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 3,
  }),],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService]
})
export class CommonModule { }
