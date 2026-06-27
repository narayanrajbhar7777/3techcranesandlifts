import { fetchClient } from './apiClient';

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  departments: number;
  designations: number;
  todayAttendance: number;
  dailyScheduledTasks: number;
  pendingTasks: number;
  completedTasks: number;
  contractors: number;
  leaveSummary: Record<string, number>;
  recentActivities: {
    id: number;
    title: string;
    time: string;
    type: string;
  }[];
}

export const getDashboardStats = () => 
  fetchClient('/dashboard/stats') as Promise<DashboardStats>;
