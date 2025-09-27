import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // สร้าง default user
  const authService = app.get(AuthService);
  await authService.createDefaultUser();
  
  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 7801;
  await app.listen(port);
  console.log(`🚀 POS Backend is running on: http://localhost:${port}`);
  console.log(`📚 MongoDB connected to database: pos`);
  console.log(`🔗 API Endpoints available at: http://localhost:${port}/auth`);
}
bootstrap();
