import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface LogParams {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: unknown;
  newValues?: unknown;
  ipAddress?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: LogParams) {
    return this.prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        oldValues: params.oldValues as any,
        newValues: params.newValues as any,
        ipAddress: params.ipAddress,
      },
    });
  }

  async findAll(params: { entityType?: string; entityId?: string; userId?: string; take?: number; skip?: number }) {
    return this.prisma.auditLog.findMany({
      where: {
        entityType: params.entityType,
        entityId: params.entityId,
        userId: params.userId,
      },
      orderBy: { createdAt: 'desc' },
      take: params.take ?? 100,
      skip: params.skip ?? 0,
      include: { user: { select: { id: true, name: true, username: true } } },
    });
  }
}
