import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsultaApiModule } from './modules/consulta-api/consulta-api.module';

@Module({
  imports: [

    ConsultaApiModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
