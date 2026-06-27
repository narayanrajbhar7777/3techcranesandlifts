import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { API_BASE_URL } from '../constants';

// Configure NProgress if desired
NProgress.configure({ showSpinner: false });

export const fetchClient = async (endpoint: string, options: RequestInit = {}) => {
  NProgress.start();
  
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // Ignore if not JSON
      }
      throw new Error(`API Error: ${errorMessage}`);
    }

    return await response.json();
  } finally {
    NProgress.done();
  }
};
