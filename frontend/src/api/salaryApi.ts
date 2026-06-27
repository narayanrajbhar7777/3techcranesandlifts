import { fetchClient } from './apiClient';
import type { Payslip, PaginatedResponse } from '../types';

export const getPayslips = (page = 1, limit = 100) => 
  fetchClient(`/payroll?page=${page}&limit=${limit}`) as Promise<PaginatedResponse<Payslip>>;

export const generatePayslip = (data: any) => 
  fetchClient('/payroll', {
    method: 'POST',
    body: JSON.stringify(data),
  }) as Promise<Payslip>;
