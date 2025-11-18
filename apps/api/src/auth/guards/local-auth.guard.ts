import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * LocalAuthGuard - Local Strategy를 활성화하는 가드
 *
 * @UseGuards(LocalAuthGuard)를 사용하면:
 * 1. 자동으로 LocalStrategy의 validate() 호출
 * 2. 검증 성공 시 request.user에 사용자 정보 저장
 * 3. 검증 실패 시 401 Unauthorized
 *
 * 사용법:
 * @UseGuards(LocalAuthGuard)
 * @Post('login')
 * login(@Request() req) {
 *   return req.user; // LocalStrategy에서 반환한 값
 * }
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
