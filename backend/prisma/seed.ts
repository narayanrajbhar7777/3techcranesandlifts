import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // 1. Users
  const adminPassword = await bcrypt.hash('admin', 10);
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

  // Remove dummy records if any exist (safety measure)
  await prisma.employeeDocument.deleteMany({});
  await prisma.employeeAddress.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.leaveRequest.deleteMany({});
  await prisma.payslip.deleteMany({});
  await prisma.employee.deleteMany({});
  
  console.log('Dummy employees cleaned up.');
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
