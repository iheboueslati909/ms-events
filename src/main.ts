import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'eventsms',
      protoPath: join(__dirname, '../proto/events-app.proto'),
      url: 'localhost:3002', 
    },
  });
 
  const configService = app.get(ConfigService);
  
  const port = configService.get<number>('APP_PORT');
  const host = configService.get<string>('APP_HOST');

  app.useGlobalPipes(new ValidationPipe());
  await app.listen();

  console.log("env = ", process.env.NODE_ENV , " host:port = " , host,":",port);
}
bootstrap();
