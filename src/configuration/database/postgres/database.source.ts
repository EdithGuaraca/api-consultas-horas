import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { DefaultNamingStrategy } from 'typeorm';

// igual que en oracle: cargamos .{env}.env
ConfigModule.forRoot({
  envFilePath: `.${process.env.NODE_ENV?.trim() || 'dev'}.env`,
  isGlobal: true,
});

const configService = new ConfigService();

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: configService.get('PG_HOST'),
  port: parseInt(configService.get('PG_PORT') || '5432', 10),
  username: configService.get('PG_USER'),
  password: configService.get('PG_PASSWORD'),
  database: configService.get('PG_DATABASE'),
  synchronize: false, // true solo en local
  entities: [
    path.resolve(__dirname, '..', '..', '..', '**', '*', '*.entity{.ts,.js}'),
  ],
  logging: process.env.AMBIENTE === 'prod' ? false : true,
  ssl: configService.get('PG_SSL') === 'true' ? { rejectUnauthorized: false } : false,
  namingStrategy: new DefaultNamingStrategy(),
};
