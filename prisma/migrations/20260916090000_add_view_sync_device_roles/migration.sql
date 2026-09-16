-- Data migration: create the actual `roles` rows for VIEWER and SYNC_DEVICE.
--
-- The earlier migration (20260912050000) only added these as values of the
-- RoleName *enum type*. GET /roles reads real rows from the `roles` table, so
-- until the rows exist the two roles can never appear in the New User form.
--
-- This deliberately lives in its own migration rather than being appended to
-- 20260912050000: Postgres refuses to use a newly added enum value inside the
-- same transaction that added it ("unsafe use of new value of enum type"), and
-- `prisma migrate deploy` wraps each migration file in a single transaction.
--
-- Idempotent on purpose — ON CONFLICT means re-running against a database that
-- already has these rows (or a machine whose local DB was restored from an
-- older production dump and re-migrated) is a harmless no-op.

INSERT INTO "roles" ("id", "name", "description", "createdAt", "updatedAt")
VALUES
  (
    gen_random_uuid()::text,
    'VIEWER',
    'Read-only access. Blocked from every mutating request by RolesGuard.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid()::text,
    'SYNC_DEVICE',
    'Machine account used by the offline desktop app to push queued changes. Not for people.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("name") DO NOTHING;