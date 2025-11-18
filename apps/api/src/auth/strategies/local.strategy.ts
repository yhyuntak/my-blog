import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

/**
 * LocalStrategy - ID/PW 로그인 인증 전략
 *
 * Passport Local Strategy를 확장하여 NestJS에서 사용
 *
 * 동작 과정:
 * 1. POST /auth/login 요청 시 자동으로 실행
 * 2. request body에서 username, password 추출
 * 3. validate() 메서드 호출
 * 4. AuthService.validateUser()로 인증
 * 5. 성공 → 사용자 정보를 request.user에 저장
 * 6. 실패 → 401 Unauthorized
 *
 * 사용법:
 * @UseGuards(LocalAuthGuard)
 * @Post('login')
 * login(@Request() req) {
 *   // req.user에 사용자 정보가 자동으로 주입됨
 * }
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username', // request body의 필드명 (기본값도 'username')
      passwordField: 'password', // request body의 필드명 (기본값도 'password')
    });
  }

  /**
   * Passport가 자동으로 호출하는 검증 메서드
   *
   * @param username request body에서 추출한 username
   * @param password request body에서 추출한 password
   * @returns 인증 성공 시 사용자 정보, 실패 시 UnauthorizedException
   *
   * Passport는 이 메서드의 반환값을 request.user에 저장합니다.
   */
  async validate(username: string, password: string): Promise<any> {
    // AuthService의 validateUser 호출 (bcrypt 검증 포함)
    const user = await this.authService.validateUser(username, password);

    // 인증 실패 (사용자 없음 또는 비밀번호 틀림)
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // 인증 성공 - 사용자 정보 반환
    // Passport가 이 값을 request.user에 자동으로 저장
    return user;
  }
}
