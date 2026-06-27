import { fetchClient } from './apiClient';

export const login = (data: any) => 
  fetchClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
