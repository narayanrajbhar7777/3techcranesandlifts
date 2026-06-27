import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/db';
import fs from 'fs';
import path from 'path';

// Assuming you add an auth middleware that sets req.user = { id: number, ... }
// For now we will accept user ID from headers or query for simplicity if no auth middleware is fully implemented
// But since we use JWT in login, we should extract ID. For this exercise, we will expect userId in body or req.user.

export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt((req as any).user?.id || req.headers['x-user-id'] || '1'); // Fallback to 1

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: {
          include: {
            role: true,
            department: true,
            designation: true
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt((req as any).user?.id || req.headers['x-user-id'] || '1');
    const { username } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username })
      },
      include: {
        employee: true
      }
    });

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt((req as any).user?.id || req.headers['x-user-id'] || '1');
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Incorrect current password' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadProfilePicture = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt((req as any).user?.id || req.headers['x-user-id'] || '1');
    
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const picturePath = `/uploads/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: picturePath }
    });

    res.json({ message: 'Profile picture updated', url: picturePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
