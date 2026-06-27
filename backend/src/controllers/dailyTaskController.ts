import { Request, Response } from 'express';
import prisma from '../config/db';

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const employeeId = req.query.employeeId ? parseInt(req.query.employeeId as string) : undefined;
    const priority = req.query.priority as string;
    const status = req.query.status as string;

    const skip = (page - 1) * limit;

    const where: any = {
      ...(search && {
        OR: [
          { taskTitle: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
          { employee: { name: { contains: search, mode: 'insensitive' } } },
        ]
      }),
      ...(employeeId && { employeeId }),
      ...(priority && { priority }),
      ...(status && { status })
    };

    const tasks = await prisma.dailyTask.findMany({
      where,
      skip,
      take: limit,
      include: {
        employee: { select: { id: true, name: true, employeeCode: true } },
        scheduledBy: { select: { id: true, username: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.dailyTask.count({ where });

    res.json({
      data: tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await prisma.dailyTask.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        employee: true,
        scheduledBy: true
      }
    });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    
    // In a real app with proper auth, scheduledById comes from req.user
    // For now we get it from body or fallback to 1 (admin)
    const scheduledById = data.scheduledById || 1;

    const newTask = await prisma.dailyTask.create({
      data: {
        employeeId: parseInt(data.employeeId),
        area: data.area,
        location: data.location,
        fromDateTime: new Date(data.fromDateTime),
        toDateTime: new Date(data.toDateTime),
        taskTitle: data.taskTitle,
        taskDescription: data.taskDescription,
        priority: data.priority,
        status: data.status || 'PENDING',
        scheduledById: scheduledById
      }
    });

    res.status(201).json(newTask);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Error creating task' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedTask = await prisma.dailyTask.update({
      where: { id: parseInt(id as string) },
      data: {
        ...(data.employeeId && { employeeId: parseInt(data.employeeId) }),
        ...(data.area && { area: data.area }),
        ...(data.location && { location: data.location }),
        ...(data.fromDateTime && { fromDateTime: new Date(data.fromDateTime) }),
        ...(data.toDateTime && { toDateTime: new Date(data.toDateTime) }),
        ...(data.taskTitle && { taskTitle: data.taskTitle }),
        ...(data.taskDescription && { taskDescription: data.taskDescription }),
        ...(data.priority && { priority: data.priority }),
        ...(data.status && { status: data.status })
      }
    });

    res.json(updatedTask);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Error updating task' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.dailyTask.delete({
      where: { id: parseInt(id as string) }
    });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
