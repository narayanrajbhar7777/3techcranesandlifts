import { fetchClient } from './apiClient';
import type { Attendance, PaginatedResponse } from '../types';

export const getAttendanceLogs = (page = 1, limit = 100) =>
  fetchClient(`/attendance?page=${page}&limit=${limit}`) as Promise<PaginatedResponse<Attendance>>;

export const checkIn = (employeeId: number) =>
  fetchClient('/attendance/checkin', {
    method: 'POST',
    body: JSON.stringify({ employeeId }),
  }) as Promise<Attendance>;

export const checkOut = (employeeId: number) =>
  fetchClient('/attendance/checkout', {
    method: 'POST',
    body: JSON.stringify({ employeeId }),
  }) as Promise<Attendance>;
