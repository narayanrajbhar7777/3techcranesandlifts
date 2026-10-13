import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;

function parseConnection(url: string) {
  const parsed = new URL(url.replace(/^mariadb:\/\//, 'mysql://'));
  const sslParam = parsed.searchParams.get('ssl');
  const useSsl = sslParam !== 'false';

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, '') || undefined,
    ssl: useSsl ? true : undefined,
    connectionLimit: 5,
  };
}

const adapter = new PrismaMariaDb(parseConnection(connectionString));
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // 1. Users
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const hrPassword = await bcrypt.hash('hr', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: adminPassword, role: 'Admin' },
    create: { username: 'admin', password: adminPassword, role: 'Admin' },
  });

  await prisma.user.upsert({
    where: { username: 'hr' },
    update: { password: hrPassword, role: 'HR' },
    create: { username: 'hr', password: hrPassword, role: 'HR' },
  });
  console.log('Users seeded.');

  // 2. Employment Types
  const empTypes = ['Permanent', 'Contractor'];
  for (const name of empTypes) {
    await prisma.employmentType.upsert({ where: { name }, update: {}, create: { name } });
  }

  // 3. Roles
  const roles = ['Admin', 'Employee', 'Contractor'];
  for (const name of roles) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  // 4. Departments
  const departments = ['Sales', 'Production', 'Account'];
  for (const name of departments) {
    await prisma.department.upsert({ where: { name }, update: {}, create: { name } });
  }

  // 5. Designations
  const designations = [
    'MD', 'Accountant', 'Electrician Engineer', 'Electrician Lead', 'Electrician Helper',
    'Mechanical Engineer', 'Supervisor', 'Drilling Operator', 'Fitting Machine Operator',
    'Lathe Machine Operator', 'Contractor', 'Welder', 'Store Man', 'Painter',
    'Helper', 'Grinder Man', 'Fitter'
  ];
  for (const name of designations) {
    await prisma.designation.upsert({ where: { name }, update: {}, create: { name } });
  }

  console.log('Master data seeded.');
  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
