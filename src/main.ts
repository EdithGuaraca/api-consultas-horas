import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3050);

  app.enableCors({ origin: "*" });
  console.log(
    "EL API SE ESTA EJECUTANDO EN EL PUERTO",
    3050
  );

}
bootstrap();
