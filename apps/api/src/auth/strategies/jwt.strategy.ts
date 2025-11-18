import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JwtStrategy - JWT 토큰 검증 전략
 *
 * Passport JWT Strategy를 확장하여 NestJS에서 사용
 *
 * 동작 과정:
 * 1. API 요청 시 Authorization 헤더에서 JWT 토큰 추출
 *    (예: "Authorization: Bearer eyJhbGciOi...")
 * 2. JWT 서명 검증 (secret 사용)
 * 3. 토큰 만료 시간 확인
 * 4. 검증 성공 → validate() 메서드 호출
 * 5. validate()의 반환값을 request.user에 저장
 * 6. 검증 실패 → 401 Unauthorized
 *
 * 사용법:
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * getProfile(@Request() req) {
 *   return req.user; // JWT payload에서 추출한 정보
 * }
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // JWT 토큰 추출 방법: Authorization 헤더의 Bearer 토큰
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 만료된 토큰 거부 (true면 만료된 토큰도 허용)
      ignoreExpiration: false,

      // JWT 서명 검증에 사용할 secret (환경변수에서 로드)
      // ! 사용: validation schema에서 JWT_SECRET은 required이므로 항상 존재
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  /**
   * JWT 검증 성공 시 호출되는 메서드
   *
   * @param payload JWT에서 디코딩된 payload
   *   - sub: 사용자 ID
   *   - username: 사용자명
   *   - role: 역할
   *   - iat: 발급 시간 (Issued At)
   *   - exp: 만료 시간 (Expiration)
   * @returns request.user에 저장될 값
   *
   * Passport가 자동으로:
   * 1. JWT 서명 검증
   * 2. 만료 시간 확인
   * 3. 검증 성공 시 이 메서드 호출
   * 4. 반환값을 request.user에 저장
   */
  async validate(payload: any) {
    // payload에서 필요한 정보만 추출하여 반환
    return {
      id: payload.sub, // sub (subject) → id로 변환
      username: payload.username,
      role: payload.role,
    };
  }
}
