import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuditService } from './audit.service';

// No @Roles() here on purpose — see DashboardController for the reasoning.
// Every route below is a GET; VIEWER is explicitly included in this app's
// "everything except Users" scope for the read-only owner role.
@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  findAll(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('userId') userId?: string,
    @Query('date') date?: string,
  ) {
    return this.auditService.findAll({ entityType, entityId, userId, date });
  }
}