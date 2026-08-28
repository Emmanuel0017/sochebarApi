-- CreateEnum
CREATE TYPE "EmptyBottleTransactionType" AS ENUM ('COLLECTED', 'RETURNED_TO_SUPPLIER', 'BROKEN', 'ADJUSTMENT');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "tracksEmptyBottles" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "empty_bottle_transactions" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "transactionType" "EmptyBottleTransactionType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empty_bottle_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "empty_bottle_transactions_productId_createdAt_idx" ON "empty_bottle_transactions"("productId", "createdAt");

-- AddForeignKey
ALTER TABLE "empty_bottle_transactions" ADD CONSTRAINT "empty_bottle_transactions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empty_bottle_transactions" ADD CONSTRAINT "empty_bottle_transactions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
