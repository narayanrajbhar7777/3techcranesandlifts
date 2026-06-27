import { fetchClient } from './apiClient';
import type { LeaveRequest, PaginatedResponse } from '../types';

export const getLeaveRequests = (page = 1, limit = 100) => 
  fetchClient(`/leaves?page=${page}&limit=${limit}`) as Promise<PaginatedResponse<LeaveRequest>>;

export const applyLeave = (data: any) => 
  fetchClient('/leaves', {
    method: 'POST',
    body: JSON.stringify(data),
  }) as Promise<LeaveRequest>;

export const updateLeaveStatus = (id: number, status: string) => 
  fetchClient(`/leaves/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }) as Promise<LeaveRequest>;
