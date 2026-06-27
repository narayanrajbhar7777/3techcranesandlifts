import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, Typography, Box } from '@mui/material';
import { getLeaveRequests, updateLeaveStatus } from '../api/leaveApi';
import type { LeaveRequest } from '../types';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  const fetchLeaves = async () => {
    try {
      const data = await getLeaveRequests(1, 100);
      setLeaves(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await updateLeaveStatus(id, status);
      fetchLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center px-8 shadow-sm border-b border-gray-200" style={{ backgroundColor: 'var(--color-header)' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Leave Management (Admin)</Typography>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Paper sx={{ width: '100%', overflow: 'hidden', bgcolor: 'var(--color-main-card)' }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Employee</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell><strong>Duration</strong></TableCell>
                    <TableCell><strong>Reason</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaves.map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell>{row.employee?.name || 'Unknown'}</TableCell>
                      <TableCell>{row.leaveType}</TableCell>
                      <TableCell>{new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>{row.reason}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} 
                          color={row.status === 'APPROVED' ? 'success' : row.status === 'REJECTED' ? 'error' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="center">
                        {row.status === 'PENDING' && (
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button size="small" variant="contained" color="success" onClick={() => updateStatus(row.id, 'APPROVED')}>Approve</Button>
                            <Button size="small" variant="contained" color="error" onClick={() => updateStatus(row.id, 'REJECTED')}>Reject</Button>
                          </Box>
                        )}
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

export default LeaveRequests;
