import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieSession({ keys: ['123456'] }));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
