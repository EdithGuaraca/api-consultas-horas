import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { PostgresdbModule } from 'src/configuration/database/postgres/postgresdb.module';

@Module({
  imports: [PostgresdbModule],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService]
})
export class SessionModule {



}
