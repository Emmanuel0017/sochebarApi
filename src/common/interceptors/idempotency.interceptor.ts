import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const IDEMPOTENCY_HEADER = 'idempotency-key';

/**
 * Makes mutating requests safe to replay.
 *
 * The frontend's offline queue attaches an `Idempotency-Key` header (a
 * UUID generated once per logical action) to every write. If that same
 * request is sent twice — because it was queued while offline and later
 * replayed, or because a response was lost in transit and the client
 * retried — we return the first response instead of running the write
 * again. Requests without the header behave exactly as before, so this
 * is fully backwards compatible with any existing client.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const req = context.switchToHttp().getRequest();
    const key = req.headers?.[IDEMPOTENCY_HEADER];

    if (!key || !MUTATING_METHODS.has(req.method)) {
      return next.handle();
    }

    const path = req.route?.path || req.path || req.url;

    const existing = await this.prisma.idempotencyKey.findUnique({
      where: { key_method_path: { key, method: req.method, path } },
    });

    if (existing) {
      const res = context.switchToHttp().getResponse();
      res.status(existing.statusCode);
      return of(existing.response);
    }

    return next.handle().pipe(
      tap((data) => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode ?? 200;
        // Only persist successful writes — a failed attempt should be
        // retryable, not permanently cached as "the" response.
        if (statusCode >= 200 && statusCode < 300) {
          this.prisma.idempotencyKey
            .create({
              data: { key, method: req.method, path, statusCode, response: data ?? {} },
            })
            .catch(() => {
              // Race with a concurrent identical request, or a transient
              // DB hiccup — never fail the actual request over this.
            });
        }
      }),
    );
  }
}
