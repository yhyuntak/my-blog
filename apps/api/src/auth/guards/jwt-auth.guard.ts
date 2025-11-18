import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard - JWT Strategy를 활성화하는 가드
 *
 * @UseGuards(JwtAuthGuard)를 사용하면:
 * 1. Authorization 헤더에서 JWT 토큰 추출
 * 2. 자동으로 JwtStrategy의 validate() 호출
 * 3. 검증 성공 시 request.user에 사용자 정보 저장
 * 4. 검증 실패 시 401 Unauthorized
 *
 * 사용법:
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * getProfile(@Request() req) {
 *   return req.user; // JwtStrategy에서 반환한 값 { id, username, role }
 * }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
