import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleName } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    // No authenticated user on this route (e.g. login, health check) —
    // nothing for a role check to do; actual authentication is
    // JwtAuthGuard's job, which always runs first since the two are
    // combined in a single @UseGuards(JwtAuthGuard, RolesGuard) per
    // controller (guards passed together like that run left-to-right,
    // so `user` is already set by the time this runs).
    if (!user) return true;

    // SYNC_DEVICE is the local app's own sync job, replaying requests a
    // real, already-authorized local user made. It isn't making its own
    // authorization decisions — it's relaying ones already approved — so
    // it needs to reach whatever endpoint the original request did,
    // across every controller's own role list. A blanket bypass here is
    // far less error-prone than adding SYNC_DEVICE to every @Roles(...)
    // array individually and risking missing one.
    if (user.role === 'SYNC_DEVICE') return true;

    // VIEWER is the owner's read-only Render login. Most existing routes
    // only ever declared @Roles() for a handful of sensitive actions —
    // everything else was reachable by any authenticated user. Rather
    // than relying on every future route remembering to exclude VIEWER,
    // this blocks it from every mutating HTTP method unconditionally,
    // regardless of @Roles() at all. This can only ever make VIEWER more
    // restricted, never less — it doesn't change behavior for any other
    // role.
    if (user.role === 'VIEWER' && MUTATING_METHODS.has(request.method)) {
      throw new ForbiddenException('This account is read-only');
    }

    const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const allowed = requiredRoles.includes(user.role);
    if (!allowed) {
      throw new ForbiddenException(`Requires one of roles: ${requiredRoles.join(', ')}`);
    }
    return true;
  }
}

