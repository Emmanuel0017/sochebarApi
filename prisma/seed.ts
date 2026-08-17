import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // ---------------- Roles ----------------
  const roleNames = ['ADMIN', 'MANAGER', 'CASHIER', 'BARTENDER', 'STOREKEEPER'] as const;
  const roles: Record<string, string> = {};
  for (const name of roleNames) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} role` },
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
