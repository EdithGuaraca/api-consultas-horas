import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresdbProvider } from './postgresdb.provider';

@Module({
  imports: [ConfigModule],
  providers: [PostgresdbProvider],
  exports: ['POSTGRES_POOL'],
})
export class PostgresdbModule { }
