import { Request, Response } from 'express';
import prisma from '../config/db';

export const checkIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId } = req.body;
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId: parseInt(employeeId),
          date
        }
      },
      update: {},
      create: {
        employeeId: parseInt(employeeId),
        date,
        checkInTime: new Date()
      }
    });

    res.json(attendance);
  } catch (error) {
    console.error('Error checking in:', error);
    res.status(500).json({ message: 'Server error checking in' });
  }
};

export const checkOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId } = req.body;
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.update({
      where: {
        employeeId_date: {
          employeeId: parseInt(employeeId),
          date
        }
      },
      data: {
        checkOutTime: new Date()
      }
    });

    res.json(attendance);
  } catch (error) {
    console.error('Error checking out:', error);
    res.status(500).json({ message: 'Server error checking out' });
  }
};

export const getAttendanceLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.attendance.findMany({
        include: { employee: true },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.attendance.count(),
    ]);

    res.json({
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error fetching attendance' });
  }
};
