import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(function (request: Request, response: Response, next: NextFunction) {
    if (
      process.env.NODE_ENV === 'production' &&
      request.hostname !== process.env.CORS_ORIGIN
    ) {
      response.status(401).json({
        status: 401,
        message: 'You are not allowed to access this resource',
      });
    }
    next();
  });
  await app.listen(3000);
}
bootstrap();
