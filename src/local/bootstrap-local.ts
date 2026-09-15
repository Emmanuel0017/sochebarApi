import * as path from 'path';
import * as fs from 'fs';
import { execFileSync } from 'child_process';
import { bootstrap } from '../main';

// embedded-postgres is an ESM-only package (package.json has "type":
// "module" and only an "exports" map, no "main"/"types"). Two separate
// problems stack up here:
//
// 1. This project's classic module resolution can't see that "exports"
//    map, so TypeScript reports the import as missing at all — the
//    @ts-ignore below is scoped to exactly that resolution mismatch, and
//    the interface right after it is what keeps the rest of this file
//    type-safe.
// 2. Under `"module": "commonjs"` (this whole Nest project's setting),
//    TypeScript silently rewrites `import('embedded-postgres')` into
//    `Promise.resolve().then(() => require('embedded-postgres'))` — a
//    real CommonJS require() in disguise. Node's require() can NEVER
//    load an ESM-only package; it throws ERR_REQUIRE_ESM. Some Node
//    builds/versions paper over this via an experimental require(esm)
//    interop path, which is why this happened to run under plain
//    ts-node/system Node during Phase 1 testing — but Electron bundles
//    its own, different Node build, where that interop isn't available,
//    and it fails outright. So this needs to be a *genuinely* dynamic
//    import regardless of which Node build ends up running it.
//
// dynamicImport() below sidesteps both: building the import() call from
// a string via `new Function(...)` hides it from TypeScript's static
// analysis entirely, so nothing rewrites it — the code that actually
// runs is a real, native `import()`, which every Node build (Electron's
// included) resolves correctly for an ESM-only package.
const dynamicImport = new Function('specifier', 'return import(specifier)') as (
  specifier: string,
) => Promise<{ default: new (options: EmbeddedPostgresOptions) => EmbeddedPostgresInstance }>;

interface EmbeddedPostgresOptions {
  databaseDir: string;
  user: string;
  password: string;
  port: number;
  persistent?: boolean;
}

interface EmbeddedPostgresInstance {
  initialise(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  createDatabase(name: string): Promise<void>;
}

/**
 * Local/offline entrypoint (Phase 1 of the offline-desktop plan).
 *
 * Standing this up separately from src/main.ts (Render's entrypoint) is
 * deliberate: Render/Neon must never be touched by this file, and this
 * file must never be reachable from a normal cloud deploy. The only
 * thing shared between the two is the actual NestJS app (AppModule) —
 * same business logic, same endpoints, same validation — just pointed
 * at a different Postgres.
 *
 * Where the data lives:
 * - Standalone/dev run (this script): ./local-data/db, next to the repo.
 * - Once wrapped in Electron (Phase 2): SOCHEBAR_DATA_DIR will be set to
 *   somewhere under the OS's app-data folder (e.g.
 *   C:\Users\<name>\AppData\Roaming\Sochebar) so it survives app
 *   updates and isn't tied to wherever the app happens to be installed.
 */

const DATA_DIR = process.env.SOCHEBAR_DATA_DIR
  ? path.join(process.env.SOCHEBAR_DATA_DIR, 'db')
  : path.join(__dirname, '..', '..', 'local-data', 'db');

const PG_PORT = Number(process.env.SOCHEBAR_LOCAL_PG_PORT ?? 54329);
const PG_USER = 'sochebar';
const PG_PASSWORD = 'sochebar_local'; // local-only, never leaves this machine
const PG_DATABASE = 'sochebar';

// If the app was previously force-quit, killed, or crashed instead of
// shutting down through the SIGINT/SIGTERM handler below, Postgres can be
// left holding a `postmaster.pid` lock file for a process that's no
// longer actually running — which then blocks every future start with
// "pre-existing shared memory block is still in use" (or a refusal to
// start at all). Since this app owns its own private, isolated Postgres
// instance — nothing else on the machine should ever be touching this
// data directory — it's always safe to check whether that PID is really
// still alive, and clear the stale lock ourselves if not, rather than
// requiring the person to go hunt down and kill a process by hand.
function clearStaleLock() {
  const lockFile = path.join(DATA_DIR, 'postmaster.pid');
  if (!fs.existsSync(lockFile)) return;

  const pid = Number(fs.readFileSync(lockFile, 'utf-8').split('\n')[0]);
  let alive = true;
  try {
    process.kill(pid, 0); // signal 0: existence check only, doesn't actually kill
  } catch {
    alive = false;
  }

  if (!alive) {
    console.log(`[local-db] Clearing stale lock from an unclean shutdown (pid ${pid} is no longer running)`);
    fs.unlinkSync(lockFile);
  }
}

async function ensureLocalPostgres(): Promise<EmbeddedPostgresInstance> {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  clearStaleLock();

  const { default: EmbeddedPostgres } = await dynamicImport('embedded-postgres');

  const pg: EmbeddedPostgresInstance = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: PG_USER,
    password: PG_PASSWORD,
    port: PG_PORT,
    persistent: true, // keep data across restarts — this is the whole point
  });

  // initialise() writes the cluster's config files; it's only needed
  // once. PG_VERSION only exists once a cluster has actually been set up,
  // so we use it as the "already initialised" marker.
  const alreadyInitialised = fs.existsSync(path.join(DATA_DIR, 'PG_VERSION'));
  if (!alreadyInitialised) {
    console.log('[local-db] First run — creating local Postgres cluster at', DATA_DIR);
    await pg.initialise();
  }

  await pg.start();
  console.log(`[local-db] Postgres running locally on port ${PG_PORT}`);

  // The cluster's data directory (and every database inside it) persists
  // across restarts, so this only needs to run once — same signal as
  // above, not a fresh existence check every launch.
  if (!alreadyInitialised) {
    await pg.createDatabase(PG_DATABASE);
  }

  return pg;
}

function runMigrations(databaseUrl: string) {
  console.log('[local-db] Applying migrations...');
  const backendRoot = path.join(__dirname, '..', '..');

  // Deliberately not shelling out to `npx prisma ...`: on Windows, `npx`
  // is actually `npx.cmd`, and execFileSync won't resolve that through
  // PATH without a shell — and once this runs inside a packaged Electron
  // app, there's no shell/PATH to resolve it through at all. Invoking
  // Prisma's CLI entry file directly with the same Node binary this
  // script is already running under sidesteps both problems.
  const prismaCli = require.resolve('prisma/build/index.js', { paths: [backendRoot] });

  execFileSync(process.execPath, [prismaCli, 'migrate', 'deploy'], {
    cwd: backendRoot,
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'inherit',
  });
}

// Registered via bootstrap()'s beforeListen hook — see the comment in
// main() for why this can't just be bolted on after bootstrap() returns.
function setupFrontendServing(app: import('@nestjs/common').INestApplication, frontendDist: string) {
  const expressApp = app.getHttpAdapter().getInstance();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express');
  expressApp.use(express.static(frontendDist));
  // SPA fallback: any non-API route serves index.html so React Router's
  // client-side routes (e.g. a hard refresh on /pos) resolve correctly
  // instead of 404ing against the file system.
  expressApp.get(/^(?!\/api).*/, (_req: unknown, res: { sendFile: (p: string) => void }) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
  console.log(`[local-db] Serving frontend from ${frontendDist}`);
}

async function main() {
  const pg = await ensureLocalPostgres();
  const databaseUrl = `postgresql://${PG_USER}:${PG_PASSWORD}@localhost:${PG_PORT}/${PG_DATABASE}?schema=public`;
  process.env.DATABASE_URL = databaseUrl;

  runMigrations(databaseUrl);

  // From here it's the exact same app as Render runs — same modules,
  // same guards, same business logic — just talking to localhost
  // instead of Neon.
  //
  // Electron sets SOCHEBAR_FRONTEND_DIST to the bundled React build so
  // the desktop app is a single server on one port: no CORS, no second
  // process to manage, and no file:// URL quirks with client-side
  // routing. Plain `npm run start:local` (backend-only dev/testing)
  // leaves this unset and behaves exactly as it did in Phase 1.
  //
  // This MUST be wired in via bootstrap()'s beforeListen hook, not after
  // bootstrap() returns — Nest registers its own catch-all 404 handling
  // as part of listen(), so anything added afterwards sits behind that
  // handler and never gets a chance to run (this is exactly the bug
  // that produced a raw 404 instead of the app on first Electron test).
  const frontendDist = process.env.SOCHEBAR_FRONTEND_DIST;
  await bootstrap(frontendDist ? (app) => setupFrontendServing(app, frontendDist) : undefined);

  const shutdown = async () => {
    console.log('[local-db] Shutting down...');
    await pg.stop();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('[local-db] Failed to start:', err);
  process.exit(1);
});
