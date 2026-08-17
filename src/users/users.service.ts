import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SAFE_SELECT = {
  id: true,
  name: true,
  username: true,
  email: true,
  isActive: true,
  roleId: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private auditService: AuditService) {}

  async findAll() {
    return this.prisma.user.findMany({ select: SAFE_SELECT, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: SAFE_SELECT });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto, actorId: string) {
    const existing = await this.prisma.user.findUnique({ where: { username: dto.username } });
    if (existing) throw new ConflictException('Username already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        username: dto.username,
        email: dto.email,
        passwordHash,
        roleId: dto.roleId,
        isActive: dto.isActive ?? true,
      },
      select: SAFE_SELECT,
    });

    await this.auditService.log({
      userId: actorId,
      action: 'CREATE_USER',
      entityType: 'User',
      entityId: user.id,
      newValues: { username: user.username, roleId: user.roleId },
    });

    return user;
  }

  async update(id: string, dto: UpdateUserDto, actorId: string) {
    const before = await this.findOne(id);
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
      select: SAFE_SELECT,
    });

    await this.auditService.log({
      userId: actorId,
      action: 'UPDATE_USER',
      entityType: 'User',
      entityId: id,
      oldValues: before,
      newValues: dto,
    });

    return user;
  }

  async setStatus(id: string, isActive: boolean, actorId: string) {
    const user = await this.prisma.user.update({ where: { id }, data: { isActive }, select: SAFE_SELECT });

    await this.auditService.log({
      userId: actorId,
      action: isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      entityType: 'User',
      entityId: id,
    });

    return user;
  }
}
