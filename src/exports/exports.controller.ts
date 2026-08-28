import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ExportsService } from './exports.service';

@Controller('exports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MANAGER')
export class ExportsController {
  constructor(private exportsService: ExportsService) {}

  @Get('daily-sheet')
  async dailySheet(@Query('date') date: string | undefined, @Res() res: Response) {
    const targetDate = date ?? new Date().toISOString().slice(0, 10);
    const buffer = await this.exportsService.buildDailySheet(targetDate);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="Soche_Bar_Inventory_${targetDate}.xlsx"`);
    res.send(buffer);
  }
}
