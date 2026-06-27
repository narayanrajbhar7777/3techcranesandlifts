import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography } from '@mui/material';
import { getAttendanceLogs } from '../api/attendanceApi';
import type { Attendance } from '../types';

const AttendanceLogs = () => {
  const [logs, setLogs] = useState<Attendance[]>([]);

  useEffect(() => {
    getAttendanceLogs(1, 100).then(data => setLogs(data.data || []));
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center px-8 shadow-sm border-b border-gray-200" style={{ backgroundColor: 'var(--color-header)' }}>
          <Typography variant="h6" fontWeight="bold">Attendance Logs (Admin)</Typography>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Paper sx={{ width: '100%', overflow: 'hidden', bgcolor: 'var(--color-main-card)' }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Employee</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Check In</strong></TableCell>
                    <TableCell><strong>Check Out</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell>{row.employee?.name || 'Unknown'}</TableCell>
                      <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                      <TableCell>{row.checkInTime ? new Date(row.checkInTime).toLocaleTimeString() : '--'}</TableCell>
                      <TableCell>{row.checkOutTime ? new Date(row.checkOutTime).toLocaleTimeString() : '--'}</TableCell>
                      <TableCell>
                        <Chip label={row.status} color={row.status === 'PRESENT' ? 'success' : 'error'} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </main>
        {/* Footer */}
        <footer className="h-12 border-t border-gray-200 flex items-center justify-center text-sm text-gray-500 shadow-inner z-0" style={{ backgroundColor: 'var(--color-footer)' }}>
          © 2026 EmpManage Pro. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AttendanceLogs;
