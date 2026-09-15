import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { SyncService } from './sync.service';

@Controller('sync')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  // Any authenticated local user can trigger a manual sync — it's a
  // read-safe, low-risk action (just pushes what's already been
  // recorded), not worth gating behind a specific role.
  @Get('status')
  status() {
    return this.syncService.getStatus();
  }

  @Post('push')
  async push() {
    await this.syncService.push();
    return this.syncService.getStatus();
  }
}
