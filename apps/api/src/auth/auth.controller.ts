import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * AuthController - 인증 관련 HTTP 엔드포인트 처리
 *
 * 엔드포인트:
 * - POST /auth/login - 로그인 (username, password → JWT)
 * - GET /auth/profile - 프로필 조회 (JWT 토큰 필요)
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   * 로그인 엔드포인트 - ID/PW를 받아서 JWT 토큰 반환
   *
   * @UseGuards(LocalAuthGuard):
   * 1. request body에서 username, password 추출
   * 2. LocalStrategy.validate() 호출 (bcrypt 검증)
   * 3. 검증 성공 → req.user에 사용자 정보 저장
   * 4. 검증 실패 → 401 Unauthorized
   *
   * @param req Express Request (user 속성에 검증된 사용자 정보 포함)
   * @returns { accessToken: string, user: { id, username, role } }
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    // LocalStrategy에서 검증된 사용자 정보 (req.user)로 JWT 생성
    return this.authService.login(req.user);
  }

  /**
   * GET /auth/profile
   * 현재 로그인한 사용자의 프로필 조회 (테스트용 엔드포인트)
   *
   * @UseGuards(JwtAuthGuard):
   * 1. Authorization 헤더에서 JWT 토큰 추출
   * 2. JwtStrategy.validate() 호출 (서명 + 만료 검증)
   * 3. 검증 성공 → req.user에 사용자 정보 저장
   * 4. 검증 실패 → 401 Unauthorized
   *
   * @param req Express Request (user 속성에 JWT payload 정보 포함)
   * @returns { id, username, role }
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    // JwtStrategy에서 추출한 사용자 정보 반환
    return req.user;
  }
}
