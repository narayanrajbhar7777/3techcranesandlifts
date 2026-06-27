import { Request, Response } from 'express';
import prisma from '../config/db';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalEmployees,
      activeEmployees,
      departmentsCount,
      designationsCount,
      todayAttendances,
      pendingTasks,
      completedTasks,
      totalContractors
    ] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { isActive: true } }),
      prisma.department.count(),
      prisma.designation.count(),
      prisma.attendance.count({ where: { date: today, status: 'PRESENT' } }),
      prisma.dailyTask.count({ where: { status: 'PENDING' } }),
      prisma.dailyTask.count({ where: { status: 'COMPLETED' } }),
      prisma.employee.count({ 
        where: { 
          employmentType: { name: 'Contractor' } 
        } 
      })
    ]);

    // Gather some recent activities
    const recentTasks = await prisma.dailyTask.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { employee: { select: { name: true } } }
    });
    
    // For today's scheduled tasks count
    const todayScheduledTasks = await prisma.dailyTask.count({
      where: {
        fromDateTime: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });
    
    // For leave summary
    const leaveSummary = await prisma.leaveRequest.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });
    const formattedLeaveSummary = leaveSummary.reduce((acc: any, curr) => {
      acc[curr.status.toLowerCase()] = curr._count.id;
      return acc;
    }, {});

    res.json({
      totalEmployees,
      activeEmployees,
      departments: departmentsCount,
      designations: designationsCount,
      todayAttendance: todayAttendances,
      dailyScheduledTasks: todayScheduledTasks,
      pendingTasks,
      completedTasks,
      contractors: totalContractors,
      leaveSummary: formattedLeaveSummary,
      recentActivities: recentTasks.map(t => ({
        id: t.id,
        title: `Task assigned to ${t.employee.name}`,
        time: t.createdAt.toISOString(),
        type: 'task'
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};
