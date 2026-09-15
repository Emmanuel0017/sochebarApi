-- AlterEnum
ALTER TYPE "RoleName" ADD VALUE 'VIEWER';
ALTER TYPE "RoleName" ADD VALUE 'SYNC_DEVICE';

-- CreateTable
CREATE TABLE "sync_outbox" (
    "id" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "body" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pushedAt" TIMESTAMP(3),
    "lastError" TEXT,

    CONSTRAINT "sync_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sync_outbox_pushedAt_idx" ON "sync_outbox"("pushedAt");
