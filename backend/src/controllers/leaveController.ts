import { Request, Response } from 'express';
import prisma from '../config/db';

export const applyLeave = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;
    
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        employeeId: parseInt(employeeId),
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason
      }
    });
    
    res.status(201).json(leaveRequest);
  } catch (error) {
    console.error('Error applying for leave:', error);
    res.status(500).json({ message: 'Server error applying for leave' });
  }
};

export const getLeaveRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      prisma.leaveRequest.findMany({
        include: { employee: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.leaveRequest.count(),
    ]);

    res.json({
      data: requests,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ message: 'Server error fetching leave requests' });
  }
};

export const updateLeaveStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const leaveRequest = await prisma.leaveRequest.update({
      where: { id: parseInt(String(id)) },
      data: { status }
    });
    
    res.json(leaveRequest);
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ message: 'Server error updating leave status' });
  }
};
