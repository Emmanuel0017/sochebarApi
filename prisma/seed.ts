import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // ---------------- Roles ----------------
  const roleSeeds = [
    { name: 'ADMIN', description: 'ADMIN role' },
    { name: 'MANAGER', description: 'MANAGER role' },
    { name: 'CASHIER', description: 'CASHIER role' },
    { name: 'BARTENDER', description: 'BARTENDER role' },
    { name: 'STOREKEEPER', description: 'STOREKEEPER role' },
    {
      name: 'VIEWER',
      description: 'Read-only access. Blocked from every mutating request by RolesGuard.',
    },
    {
      name: 'SYNC_DEVICE',
      description:
        'Machine account used by the offline desktop app to push queued changes. Not for people.',
    },
  ] as const;
  const roles: Record<string, string> = {};
  for (const { name, description } of roleSeeds) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description },
    });
    roles[name] = role.id;
  }

  // ---------------- Admin user ----------------
  // IMPORTANT: change this password immediately after first login in any
  // real deployment. Do not ship this seed to production untouched.
  const adminPasswordHash = await bcrypt.hash('ChangeMe123!', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'System Administrator',
      username: 'admin',
      email: 'admin@bar.local',
      passwordHash: adminPasswordHash,
      roleId: roles.ADMIN,
      isActive: true,
    },
  });

  // ---------------- Categories ----------------
  const categoryNames = ['Beer', 'Soft Drinks', 'Spirits', 'Water', 'Wine', 'Energy Drinks', 'Juices', 'Other'];
  const categories: Record<string, string> = {};
  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories[name] = cat.id;
  }

  // ---------------- Expense categories ----------------
  const expenseCategoryNames = [
    'Electricity',
    'Water',
    'Transport',
    'Salaries',
    'Cleaning',
    'Security',
    'Maintenance',
    'Entertainment',
    'Licensing',
    'Other',
  ];
  for (const name of expenseCategoryNames) {
    await prisma.expenseCategory.upsert({ where: { name }, update: {}, create: { name } });
  }

  // ---------------- Sample product: Carlsberg 330ml (Case/Bottle units) ----------------
  const existing = await prisma.product.findFirst({ where: { name: 'Carlsberg 330ml' } });
  if (!existing) {
    const product = await prisma.product.create({
      data: {
        name: 'Carlsberg 330ml',
        categoryId: categories.Beer,
        sku: 'BEER-CAR-330',
      },
    });

    const bottleUnit = await prisma.productUnit.create({
      data: {
        productId: product.id,
        name: 'Bottle',
        quantityInBaseUnit: 1,
        isBaseUnit: true,
        isSaleUnit: true,
      },
    });

    await prisma.productUnit.create({
      data: {
        productId: product.id,
        name: 'Case',
        quantityInBaseUnit: 24,
        isPurchaseUnit: true,
      },
    });

    const adminUser = await prisma.user.findUniqueOrThrow({ where: { username: 'admin' } });
    await prisma.productPrice.create({
      data: {
        productId: product.id,
        unitId: bottleUnit.id,
        price: 1500,
        priceType: 'NORMAL',
        createdById: adminUser.id,
      },
    });
  }

  // ---------------- Bar's real product catalog (from the workbook) ----------------
  // Each item gets a single "Bottle/Unit" base unit that is both the
  // purchase and sale unit (matches how the workbook counts everything -
  // one row per item, no case/bottle conversion). Prices below are the
  // workbook's current NORMAL unit price; adjust in-app any time via
  // Prices without needing another seed run.
  const workbookProducts: Array<{ name: string; category: string; price: number }> = [
    { name: 'Carlsberg Green', category: 'Beer', price: 3500 },
    { name: 'Carlsberg Special', category: 'Beer', price: 3500 },
    { name: 'Carlsberg Chill', category: 'Beer', price: 4000 },
    { name: 'Castel Beer', category: 'Beer', price: 3000 },
    { name: 'Kuche Kuche', category: 'Beer', price: 3000 },
    { name: 'Pomme Breeze', category: 'Beer', price: 4000 },
    { name: 'Doppel Munich', category: 'Beer', price: 3000 },
    { name: 'Sapitwa', category: 'Beer', price: 3000 },
    { name: 'Baby Gin', category: 'Spirits', price: 10000 },
    { name: 'Premier Brandy', category: 'Spirits', price: 45000 },
    { name: 'Baby Brandy', category: 'Spirits', price: 15000 },
    { name: 'Fanta', category: 'Soft Drinks', price: 1500 },
    { name: 'Coke', category: 'Soft Drinks', price: 1500 },
    {name: 'Sprite', category: 'Soft Drinks', price: 1500 },
    { name: 'Cherryplum', category: 'Juices', price: 1500 },
    { name: 'Cocopina', category: 'Juices', price: 1500 },
    { name: 'Water', category: 'Water', price: 1000 },
    { name: 'Kumbucha', category: 'Other', price: 3000 },
    { name: 'Nip', category: 'Spirits', price: 2500 },
    { name: 'Krunchy Naks', category: 'Other', price: 1000 },
    { name: 'Yonse Bho', category: 'Juices', price: 1000 },
    { name: 'Yes Energy', category: 'Energy Drinks', price: 2000 },
    { name: 'Jameson', category: 'Spirits', price: 6000 },
    { name: 'Grants', category: 'Spirits', price: 4000 },
    { name: 'Harrier', category: 'Spirits', price: 2500 },
    { name: 'Wine', category: 'Wine', price: 5000 },
    { name: 'Savannah', category: 'Beer', price: 8000 },
    { name: 'Hunters', category: 'Beer', price: 8000 },
    { name: 'Brutal Cane', category: 'Beer', price: 10000 },
    { name: 'Castle Lite', category: 'Beer', price: 8000 },
    { name: 'Best Small', category: 'Spirits', price: 8000 },
    { name: 'Best Big', category: 'Spirits', price: 30000 },
    { name: 'Chapati', category: 'Other', price: 700 },
    { name: 'Mahewu', category: 'Other', price: 700 },
    { name: 'Samusa', category: 'Other', price: 700 },
  ];

  const seedAdmin = await prisma.user.findUniqueOrThrow({ where: { username: 'admin' } });
  for (const wp of workbookProducts) {
    const existingProduct = await prisma.product.findFirst({ where: { name: wp.name } });
    if (existingProduct) continue;

    const p = await prisma.product.create({
      data: { name: wp.name, categoryId: categories[wp.category] },
    });
    const unit = await prisma.productUnit.create({
      data: { productId: p.id, name: 'Unit', quantityInBaseUnit: 1, isBaseUnit: true, isPurchaseUnit: true, isSaleUnit: true },
    });
    await prisma.productPrice.create({
      data: { productId: p.id, unitId: unit.id, price: wp.price, priceType: 'NORMAL', createdById: seedAdmin.id },
    });
  }

  // ---------------- Partners (capital accounts) ----------------
  for (const name of ['Calleb', 'Moses']) {
    await prisma.partner.upsert({ where: { name }, update: {}, create: { name } });
  }

  // ---------------- Cash accounts (Bank / Mobile Money / Petty Cash) ----------------
  const cashAccountSeeds: Array<{ name: string; type: 'BANK' | 'MOBILE_MONEY' | 'PETTY_CASH' }> = [
    { name: 'Bank', type: 'BANK' },
    { name: 'Airtel Money', type: 'MOBILE_MONEY' },
    { name: 'Petty Cash', type: 'PETTY_CASH' },
  ];
  for (const ca of cashAccountSeeds) {
    await prisma.cashAccount.upsert({ where: { name: ca.name }, update: {}, create: ca });
  }

  console.log('Seed complete. Login with username "admin" / password "ChangeMe123!" (change it immediately).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });