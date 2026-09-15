import { NestFactory } from '@nestjs/core';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * @param beforeListen Optional hook invoked after Nest's own setup
 *   (global prefix, CORS, etc.) but before `app.listen()`. This matters:
 *   Nest registers its own catch-all "not found" handling as part of
 *   listen()/init(), so anything that needs to sit in front of that —
 *   like the local/Electron entrypoint's static frontend serving — has
 *   to be added here, not after `bootstrap()` returns. Adding it
 *   afterwards means Nest's own 404 handler intercepts every unmatched
 *   route first, which is exactly the bug this hook exists to avoid.
 */
export async function bootstrap(beforeListen?: (app: INestApplication) => void | Promise<void>) {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  await beforeListen?.(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Bar POS API running on port ${port}`);
  return app;
}

// Only auto-start when this file is run directly (normal Render deploy).
// The local/Electron entrypoint (src/local/bootstrap-local.ts) imports
// `bootstrap` itself, after standing up the embedded Postgres instance
// and pointing DATABASE_URL at it, so it must NOT be auto-invoked here.
if (require.main === module) {
  bootstrap();
}
