-- AlterTable
ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "clientSaleId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "sales_clientSaleId_key" ON "sales"("clientSaleId");

-- Sequence used for human-readable invoice numbers (see SalesService.generateInvoiceNumber)
CREATE SEQUENCE IF NOT EXISTS "sales_invoice_seq";