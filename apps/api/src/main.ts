import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 (프론트엔드와 통신 허용)
  app.enableCors();

  // 환경변수에서 포트 가져오기, 기본값 3000
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
