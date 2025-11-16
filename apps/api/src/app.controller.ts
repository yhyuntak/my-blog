import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // GET / - 루트 엔드포인트
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // GET /health - 헬스체크 엔드포인트
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
