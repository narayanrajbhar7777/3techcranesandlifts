import { fetchClient } from './apiClient';
import type { Employee, PaginatedResponse } from '../types';
import NProgress from 'nprogress';
import { API_BASE_URL } from '../constants';

export const getEmployees = (page = 1, limit = 10, search = '') => 
  fetchClient(`/employees?page=${page}&limit=${limit}&search=${search}`) as Promise<PaginatedResponse<Employee>>;

export const getEmployee = (id: number) => 
  fetchClient(`/employees/${id}`) as Promise<Employee>;

export const createEmployee = (data: any) => 
  fetchClient('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateEmployee = (id: number, data: any) => 
  fetchClient(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const updateEmployeeStatus = (id: number, isActive: boolean) => 
  fetchClient(`/employees/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });

export const deleteEmployee = (id: number) => 
  fetchClient(`/employees/${id}`, {
    method: 'DELETE',
  });

export const getEmployeeFormConfigs = () => 
  fetchClient('/employees/config');

export const uploadDocument = async (file: File): Promise<{ url: string; originalName: string; mimeType: string; size: number }> => {
  NProgress.start();
  const form = new FormData();
  form.append('file', file);
  
  const token = localStorage.getItem('token');
  const headers: any = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(`${API_BASE_URL}/employees/upload`, {
      method: 'POST',
      headers,
      body: form,
    });
    
    if (!response.ok) throw new Error('Upload failed');
    return await response.json();
  } finally {
    NProgress.done();
  }
};
