import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Inserting 60 dummy employees...');
  
  let role = await prisma.role.findFirst({ where: { name: 'Employee' } });
  if (!role) role = await prisma.role.findFirst();
  
  let dept = await prisma.department.findFirst({ where: { name: 'Production' } });
  if (!dept) dept = await prisma.department.findFirst();

  let designation1 = await prisma.designation.findFirst({ where: { name: 'Supervisor' } });
  let designation2 = await prisma.designation.findFirst({ where: { name: 'Helper' } });
  
  let empType1 = await prisma.employmentType.findFirst({ where: { name: 'Permanent' } });
  let empType2 = await prisma.employmentType.findFirst({ where: { name: 'Contractor' } });

  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'Chris', 'Sarah', 'David', 'Jessica', 'Daniel', 'Ashley'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

  if (!role || !dept || !designation1 || !designation2 || !empType1 || !empType2) {
    console.error('Missing required master data. Please run seed.ts first.');
    process.exit(1);
  }

  for (let i = 1; i <= 60; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${fn} ${ln}`;
    const email = `dummy${Math.floor(Math.random() * 10000)}_${i}@example.com`;
    
    await prisma.employee.create({
      data: {
        employeeCode: `EMP${1000 + i}`,
        name: fullName,
        email: email,
        mobileNo: `+1555${Math.floor(1000000 + Math.random() * 9000000)}`,
        emergencyContactNo: `+1555${Math.floor(1000000 + Math.random() * 9000000)}`,
        status: 'ACTIVE',
        isActive: true,
        dob: new Date('1990-01-01'),
        doj: new Date('2023-01-01'),
        role: { connect: { id: role.id } },
        department: { connect: { id: dept.id } },
        designation: { connect: { id: i % 3 === 0 ? designation1.id : designation2.id } },
        employmentType: { connect: { id: i % 5 === 0 ? empType2.id : empType1.id } },
      }
    });
  }

  console.log('Successfully inserted 60 dummy employees!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
