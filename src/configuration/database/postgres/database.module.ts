import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './database.source';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmModuleOptions,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule { }
