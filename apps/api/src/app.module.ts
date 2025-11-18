import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validationSchema } from './config/validation';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 환경변수 로드 및 검증 (.env 파일)
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 사용 가능
      envFilePath: '.env',
      validationSchema, // Joi 스키마로 환경변수 검증
      validationOptions: {
        allowUnknown: true, // 알 수 없는 환경변수 허용
        abortEarly: false, // 모든 검증 에러 표시
      },
    }),
    PrismaModule, // Prisma DB 연결 (전역)
    AuthModule, // 인증 모듈
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
