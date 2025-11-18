import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule - Prisma Client를 전역으로 제공하는 모듈
 *
 * @Global() 데코레이터:
 * - 모든 모듈에서 PrismaService를 import 없이 사용 가능
 * - AppModule에 한 번만 등록하면 됨
 *
 * 사용법:
 * AppModule의 imports에 PrismaModule 추가
 * → 모든 서비스에서 PrismaService 주입 가능
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
