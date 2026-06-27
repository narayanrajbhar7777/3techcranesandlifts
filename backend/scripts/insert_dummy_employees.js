const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Inserting 60 dummy employees...');
  
  let role = await prisma.role.findFirst({ where: { name: 'Employee' } });
  if (!role) role = await prisma.role.findFirst();
  
  let dept = await prisma.department.findFirst({ where: { name: 'Engineering' } });
  if (!dept) dept = await prisma.department.findFirst();
  
  let subDept = await prisma.subDepartment.findFirst();

  const hashedPassword = await bcrypt.hash('password123', 10);
  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'Chris', 'Sarah', 'David', 'Jessica', 'Daniel', 'Ashley'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

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
        password: hashedPassword,
        mobileNo: `+1555${Math.floor(1000000 + Math.random() * 9000000)}`,
        employeeType: i % 5 === 0 ? 'Contract' : 'Company',
        designation: i % 3 === 0 ? 'Senior Engineer' : 'Software Engineer',
        status: 'ACTIVE',
        isActive: true,
        ...(role && { roleId: role.id }),
        ...(dept && { departmentId: dept.id }),
        ...(subDept && { subDepartmentId: subDept.id }),
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
