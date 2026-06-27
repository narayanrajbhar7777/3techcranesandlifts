import { fetchClient } from './apiClient';
import { API_BASE_URL } from '../constants';
import NProgress from 'nprogress';

export const getMyProfile = () => fetchClient('/users/profile');

export const updateMyProfile = (data: any) => 
  fetchClient('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const changePassword = (data: any) => 
  fetchClient('/users/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const uploadProfilePicture = async (file: File) => {
  NProgress.start();
  const form = new FormData();
  form.append('file', file);
  
  const token = localStorage.getItem('token');
  const headers: any = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(`${API_BASE_URL}/users/upload-picture`, {
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
