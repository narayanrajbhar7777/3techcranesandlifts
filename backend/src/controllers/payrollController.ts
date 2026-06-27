import { Request, Response } from 'express';
import prisma from '../config/db';

export const generatePayslip = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId, month, year, basicSalary, allowances, deductions } = req.body;
    
    const netSalary = parseFloat(basicSalary) + parseFloat(allowances) - parseFloat(deductions);

    const payslip = await prisma.payslip.upsert({
      where: {
        employeeId_month_year: {
          employeeId: parseInt(employeeId),
          month: parseInt(month),
          year: parseInt(year)
        }
      },
      update: {
        basicSalary: parseFloat(basicSalary),
        allowances: parseFloat(allowances),
        deductions: parseFloat(deductions),
        netSalary
      },
      create: {
        employeeId: parseInt(employeeId),
        month: parseInt(month),
        year: parseInt(year),
        basicSalary: parseFloat(basicSalary),
        allowances: parseFloat(allowances),
        deductions: parseFloat(deductions),
        netSalary
      }
    });

    res.json(payslip);
  } catch (error) {
    console.error('Error generating payslip:', error);
    res.status(500).json({ message: 'Server error generating payslip' });
  }
};

export const getPayslips = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [payslips, total] = await Promise.all([
      prisma.payslip.findMany({
        include: { employee: true },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.payslip.count(),
    ]);

    res.json({
      data: payslips,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching payslips:', error);
    res.status(500).json({ message: 'Server error fetching payslips' });
  }
};
