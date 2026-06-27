import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CustomThemeProvider } from './context/ThemeContext';
import ThemeSettings from './components/ThemeSettings';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employee from './pages/Employee';
import EmployeeManagement from './pages/EmployeeManagement';
import LeaveRequests from './pages/LeaveRequests';
import ApplyLeave from './pages/ApplyLeave';
import AttendanceLogs from './pages/AttendanceLogs';
import PayrollList from './pages/PayrollList';

import DailyTaskSchedule from './pages/DailyTaskSchedule';

function App() {
  return (
    <CustomThemeProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/leaves" element={<LeaveRequests />} />
        <Route path="/leaves/apply" element={<ApplyLeave />} />
        <Route path="/attendance" element={<AttendanceLogs />} />
        <Route path="/payroll" element={<PayrollList />} />
        <Route path="/daily-tasks" element={<DailyTaskSchedule />} />
      </Routes>
      <ThemeSettings />
    </Router>
    </CustomThemeProvider>
  );
}

export default App;
