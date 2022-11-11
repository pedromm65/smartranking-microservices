import { NestFactory } from '@nestjs/core'
import { Logger,  } from '@nestjs/common';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices'
const logger = new Logger('Main')

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:GtlwqpmsPK00@3.94.160.160:5672/smartranking'],
      queue: 'admin-backend'
    }
  });

  await app.listen();
}
bootstrap();
