import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  async getHealth() {
    let db = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      db = 'down';
    }
    return {
      status: 'ok',
      db,
    };
  }

  @Get('whoami')
  whoami(@Req() req: Request) {
    return {
      ip: req.ip, // honours trust proxy
      socketIp: req.socket.remoteAddress, // always the direct peer (the ALB)
      protocol: req.protocol,
      xff: req.headers['x-forwarded-for'] ?? null,
    };
  }
}
