import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Paper, Typography, TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { applyLeave } from '../api/leaveApi';

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: '1', // Hardcoded for demo
    leaveType: 'Sick',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await applyLeave(formData);
      navigate('/leaves');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center px-8 shadow-sm border-b border-gray-200" style={{ backgroundColor: 'var(--color-header)' }}>
          <Typography variant="h6" fontWeight="bold">Apply for Leave</Typography>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', bgcolor: 'var(--color-main-card)' }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Leave Type</InputLabel>
                    <Select value={formData.leaveType} label="Leave Type" onChange={(e) => setFormData({...formData, leaveType: e.target.value})}>
                      <MenuItem value="Sick">Sick Leave</MenuItem>
                      <MenuItem value="Casual">Casual Leave</MenuItem>
                      <MenuItem value="Earned">Earned Leave</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth type="date" label="Start Date" InputLabelProps={{ shrink: true }} required onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth type="date" label="End Date" InputLabelProps={{ shrink: true }} required onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={4} label="Reason" required onChange={(e) => setFormData({...formData, reason: e.target.value})} />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" fullWidth>Submit Request</Button>
                </Grid>
              </Grid>
            </form>
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

export default ApplyLeave;
