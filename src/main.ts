import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from './modules/utils/http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({ origin: "*" });


  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3050);
  console.log(
    "EL API SE ESTA EJECUTANDO EN EL PUERTO",
    3050
  );

}
bootstrap();
