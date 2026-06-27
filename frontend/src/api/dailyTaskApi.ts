import { fetchClient } from './apiClient';
import type { PaginatedResponse } from '../types';

export interface DailyTask {
  id: number;
  employeeId: number;
  employee?: { id: number; name: string; employeeCode: string };
  area: string;
  location: string;
  fromDateTime: string;
  toDateTime: string;
  taskTitle: string;
  taskDescription: string;
  priority: string;
  scheduledById: number;
  scheduledBy?: { id: number; username: string };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const getTasks = (page = 1, limit = 10, search = '', employeeId?: number, priority?: string, status?: string) => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
    ...(employeeId ? { employeeId: employeeId.toString() } : {}),
    ...(priority ? { priority } : {}),
    ...(status ? { status } : {})
  });
  return fetchClient(`/daily-tasks?${query}`) as Promise<PaginatedResponse<DailyTask>>;
};

export const getTask = (id: number) => 
  fetchClient(`/daily-tasks/${id}`) as Promise<DailyTask>;

export const createTask = (data: Partial<DailyTask>) => 
  fetchClient('/daily-tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateTask = (id: number, data: Partial<DailyTask>) => 
  fetchClient(`/daily-tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteTask = (id: number) => 
  fetchClient(`/daily-tasks/${id}`, {
    method: 'DELETE',
  });
