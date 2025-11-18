import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

/**
 * AuthService - 인증 관련 비즈니스 로직을 담당
 *
 * 역할:
 * - 사용자 인증 (username/password 검증)
 * - JWT 토큰 생성
 * - 비밀번호 해싱 및 비교
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * username으로 사용자를 찾고 비밀번호를 검증
   *
   * @param username 사용자명
   * @param password 평문 비밀번호
   * @returns 검증 성공 시 사용자 정보 (비밀번호 제외), 실패 시 null
   *
   * 동작 과정:
   * 1. DB에서 username으로 사용자 조회
   * 2. 사용자 없으면 → null 반환
   * 3. bcrypt.compare(평문, 해시)로 비밀번호 검증
   * 4. 비밀번호 틀리면 → null 반환
   * 5. 성공 → 사용자 정보 반환 (password 필드 제외)
   */
  async validateUser(username: string, password: string): Promise<any> {
    // 1. DB에서 사용자 조회
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    // 2. 사용자가 없으면 null 반환
    if (!user) {
      return null;
    }

    // 3. 비밀번호가 없는 경우 (GitHub OAuth 전용 계정)
    if (!user.password) {
      return null;
    }

    // 4. bcrypt로 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // 5. 비밀번호가 틀리면 null 반환
    if (!isPasswordValid) {
      return null;
    }

    // 6. 성공 - 비밀번호 제외하고 반환
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * 사용자 정보로 JWT 토큰 생성
   *
   * @param user 사용자 정보 (id, username, role)
   * @returns { accessToken: string, user: { id, username, role } }
   *
   * JWT Payload에 포함되는 정보:
   * - sub: 사용자 ID (subject - JWT 표준 클레임)
   * - username: 사용자명
   * - role: 역할 (admin | user)
   */
  async login(user: any) {
    // JWT Payload 구성
    const payload = {
      sub: user.id, // sub = subject (JWT 표준)
      username: user.username,
      role: user.role,
    };

    // JWT 토큰 생성 (JwtModule에서 설정한 secret, expiresIn 자동 적용)
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}
