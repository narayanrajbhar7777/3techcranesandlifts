export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  EMPLOYEES: '/employees',
  DEPARTMENTS: '/departments',
  ATTENDANCE: '/attendance',
  SALARY: '/salary',
  LEAVES: '/leaves',
};

export const STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DRAFT: 'DRAFT',
};

export const ROLES = {
  ADMIN: 'Admin',
  HR: 'HR',
  EMPLOYEE: 'Employee',
};

export const MESSAGES = {
  UPLOAD_SUCCESS: 'File uploaded successfully',
  UPLOAD_FAILED: 'File upload failed',
  SAVE_SUCCESS: 'Saved successfully',
  ERROR: 'Something went wrong',
};
