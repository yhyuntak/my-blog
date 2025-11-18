import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService - Prisma Client를 관리하는 서비스
 *
 * 역할:
 * - Prisma Client 인스턴스를 제공
 * - 앱 시작 시 DB 연결
 * - 앱 종료 시 DB 연결 해제
 *
 * 사용법:
 * constructor(private prisma: PrismaService) {}
 * await this.prisma.user.findUnique({ where: { username } })
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * 모듈 초기화 시 DB 연결
   */
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected');
  }

  /**
   * 모듈 종료 시 DB 연결 해제
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Database disconnected');
  }
}
