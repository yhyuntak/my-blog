import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * AuthModule - 인증 관련 모든 기능을 담당하는 모듈
 *
 * 포함:
 * - AuthService: 인증 비즈니스 로직
 * - AuthController: 인증 HTTP 엔드포인트
 * - JwtModule: JWT 토큰 생성/검증
 * - PassportModule: 인증 전략 관리
 * - PrismaModule: DB 접근 (전역 모듈이라 자동 주입)
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET')!,
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') || '1h') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService], // 다른 모듈에서도 AuthService 사용 가능
})
export class AuthModule {}
