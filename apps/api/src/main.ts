import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 (프론트엔드와 통신 허용)
  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL  // 프로덕션: .env에서 지정한 도메인만
      : true,                      // 개발: 모든 도메인 허용
    credentials: true,             // 쿠키/인증 헤더 허용
  });

  // 환경변수에서 포트 가져오기, 기본값 3000
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
