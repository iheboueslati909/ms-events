import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT');
  const host = configService.get<string>('APP_HOST');

  const microservice = app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: host,
      port: port,
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  await microservice.listen();

  console.log("env = ", process.env.NODE_ENV , " host:port = " , host,":",port);
}
bootstrap();
