import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Deliberately has NO @UseGuards(JwtAuthGuard) - an uptime pinger has no
// login token, and shouldn't need one just to say "are you alive".
//
// This does a trivial DB round trip (not just "the Node process is up") on
// purpose: the whole point is to stop both Render's web service AND the
// Neon Postgres compute from going idle-to-sleep. A ping that only touched
// the Node process would keep Render awake but let Neon suspend anyway.
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async check() {
    const start = Date.now();
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      status: 'ok',
      db: 'connected',
      dbLatencyMs: Date.now() - start,
      time: new Date().toISOString(),
    };
  }
}
