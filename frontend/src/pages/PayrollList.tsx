import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { getPayslips, generatePayslip } from '../api/salaryApi';
import type { Payslip } from '../types';

const PayrollList = () => {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ employeeId: '1', month: '6', year: '2026', basicSalary: '5000', allowances: '1000', deductions: '500' });

  const fetchPayslips = () => {
    getPayslips(1, 100).then(data => setPayslips(data.data || []));
  };

  useEffect(() => { fetchPayslips(); }, []);

  const handleGenerate = async () => {
    try {
      await generatePayslip(formData);
      setOpen(false);
      fetchPayslips();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 shadow-sm border-b border-gray-200" style={{ backgroundColor: 'var(--color-header)' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Payroll (Admin)</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>Generate Payslip</Button>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Paper sx={{ width: '100%', overflow: 'hidden', bgcolor: 'var(--color-main-card)' }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Employee</strong></TableCell>
                    <TableCell><strong>Month/Year</strong></TableCell>
                    <TableCell><strong>Basic</strong></TableCell>
                    <TableCell><strong>Net Salary</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payslips.map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell>{row.employee?.name || 'Unknown'}</TableCell>
                      <TableCell>{row.month}/{row.year}</TableCell>
                      <TableCell>${row.basicSalary}</TableCell>
                      <TableCell><strong>${row.netSalary}</strong></TableCell>
                      <TableCell>{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Generate Payslip</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="Employee ID" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="Month" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} />
                <TextField label="Year" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
              </Box>
              <TextField label="Basic Salary" value={formData.basicSalary} onChange={e => setFormData({...formData, basicSalary: e.target.value})} />
              <TextField label="Allowances" value={formData.allowances} onChange={e => setFormData({...formData, allowances: e.target.value})} />
              <TextField label="Deductions" value={formData.deductions} onChange={e => setFormData({...formData, deductions: e.target.value})} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleGenerate}>Generate</Button>
            </DialogActions>
          </Dialog>

        </main>
        {/* Footer */}
        <footer className="h-12 border-t border-gray-200 flex items-center justify-center text-sm text-gray-500 shadow-inner z-0" style={{ backgroundColor: 'var(--color-footer)' }}>
          © 2026 EmpManage Pro. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default PayrollList;
