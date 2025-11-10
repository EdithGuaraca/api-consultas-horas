import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { envSchema } from 'env.schema';
import { HttpExceptionFilter } from './modules/utils/http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const { error } = envSchema.validate(process.env);
  if (error) {
    throw new Error(`Error en el archivo .env: ${error.message}`);
  }
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({ origin: "*" });
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(
    'EL API SE ESTA EJECUTANDO EN EL PUERTO',
    configService.get('PORT'),
  );

}
bootstrap();
