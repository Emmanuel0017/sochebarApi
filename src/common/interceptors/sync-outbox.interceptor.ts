import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const IDEMPOTENCY_HEADER = 'idempotency-key';

// Routes that must never be replayed against Render as-is: auth endpoints
// are meaningless to "sync" (Render has its own separate sessions), and
// sync's own endpoints obviously shouldn't queue themselves.
const EXCLUDED_PATH_PREFIXES = ['/api/auth', '/api/sync'];

/**
 * Populates the local app's outbox for the sync job to push upward later.
 *
 * This is deliberately a no-op unless SOCHEBAR_DATA_DIR is set — i.e.
 * unless this is actually the local/offline app (see bootstrap-local.ts).
 * On Render this interceptor is registered but never does anything,
 * since Render has no "local" to sync from; keeping the registration
 * unconditional (rather than branching in app.module.ts) means the two
 * deployments never structurally diverge, only behave differently based
 * on environment — same approach as the frontend static-serving hook.
 */
@Injectable()
export class SyncOutboxInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (!process.env.SOCHEBAR_DATA_DIR) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest();
    const method = req.method as string;
    // originalUrl (not baseUrl + route.path) because some controllers
    // nest under a parent path (e.g. PricesController is mounted at
    // 'products/:productId/prices') — originalUrl is always the actual,
    // complete incoming path regardless of how routing composed it.
    const path: string = (req.originalUrl ?? req.url).split('?')[0];

    if (!MUTATING_METHODS.has(method) || EXCLUDED_PATH_PREFIXES.some((p) => path.startsWith(p))) {
      return next.handle();
    }

    const key = req.headers?.[IDEMPOTENCY_HEADER];
    if (!key) {
      // Every mutating request already gets one from the frontend's
      // api.ts, but don't let a request without one (e.g. hit directly
      // via curl during testing) crash — just skip logging it.
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode ?? 200;
        if (statusCode >= 200 && statusCode < 300) {
          this.prisma.syncOutbox
            .upsert({
              where: { id: key },
              create: { id: key, method, path, body: req.body ?? {} },
              // If this exact request already got logged (e.g. the
              // client retried after a lost response), don't touch
              // pushedAt/lastError on a row that may already be synced.
              update: {},
            })
            .catch(() => {
              // Never fail the actual request over an outbox logging
              // hiccup — worst case this one change needs a manual
              // resync later, which is far better than the request
              // itself failing for a reason invisible to the user.
            });
        }
      }),
    );
  }
}
