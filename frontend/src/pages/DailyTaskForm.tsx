import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Box, Paper, Grid } from '@mui/material';
import { getEmployees } from '../api/employeeApi';
import { createTask, updateTask } from '../api/dailyTaskApi';
import type { DailyTask } from '../api/dailyTaskApi';

interface DailyTaskFormProps {
  editTask: DailyTask | null;
  onComplete: () => void;
  onCancel: () => void;
}

const DailyTaskForm: React.FC<DailyTaskFormProps> = ({ editTask, onComplete, onCancel }) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeId: '',
    area: 'Plant',
    location: '',
    fromDateTime: '',
    toDateTime: '',
    taskTitle: '',
    taskDescription: '',
    priority: 'Medium',
    status: 'PENDING'
  });

  useEffect(() => {
    getEmployees(1, 1000).then(res => setEmployees(res.data || []));
  }, []);

  useEffect(() => {
    if (editTask) {
      setFormData({
        employeeId: editTask.employeeId.toString(),
        area: editTask.area,
        location: editTask.location,
        fromDateTime: new Date(editTask.fromDateTime).toISOString().slice(0, 16),
        toDateTime: new Date(editTask.toDateTime).toISOString().slice(0, 16),
        taskTitle: editTask.taskTitle,
        taskDescription: editTask.taskDescription,
        priority: editTask.priority,
        status: editTask.status
      });
    }
  }, [editTask]);

  const handleSubmit = async () => {
    if (!formData.employeeId || !formData.taskTitle || !formData.fromDateTime || !formData.toDateTime) {
      alert('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const scheduledById = user ? user.id : 1;

      if (editTask) {
        await updateTask(editTask.id, formData);
      } else {
        await createTask({ ...formData, employeeId: parseInt(formData.employeeId), scheduledById });
      }
      onComplete();
    } catch (err: any) {
      alert(err.message || 'Error saving task');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Box component="header" sx={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, bgcolor: 'var(--color-header)', borderBottom: 1, borderColor: 'divider', boxShadow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-header)] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--text-header)' }}>
            {editTask ? 'Edit Task' : 'Add New Task'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" disabled={loading} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" disabled={loading} onClick={handleSubmit} startIcon={<Save size={16} />}>
            {loading ? 'Saving...' : 'Save Task'}
          </Button>
        </Box>
      </Box>

      <Box component="main" sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 4 }, bgcolor: 'background.default' }}>
        <Paper sx={{ p: { xs: 3, md: 5 }, maxWidth: 800, mx: 'auto', bgcolor: 'var(--color-main-card)' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 4, borderBottom: 1, borderColor: 'divider', pb: 1, color: 'var(--text-header)' }}>
            Task Details
          </Typography>
          
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Employee</InputLabel>
                <Select
                  label="Employee"
                  value={formData.employeeId}
                  onChange={(e) => handleChange('employeeId', e.target.value as string)}
                >
                  {employees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id.toString()}>{emp.name} ({emp.employeeCode})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Area</InputLabel>
                <Select label="Area" value={formData.area} onChange={(e) => handleChange('area', e.target.value as string)}>
                  <MenuItem value="Plant">Plant</MenuItem>
                  <MenuItem value="Site">Site</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth size="small" label="Location" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField 
                fullWidth 
                size="small" 
                type="datetime-local" 
                label="From Date & Time" 
                required
                slotProps={{ inputLabel: { shrink: true } }} 
                value={formData.fromDateTime} 
                onChange={(e) => handleChange('fromDateTime', e.target.value)} 
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField 
                fullWidth 
                size="small" 
                type="datetime-local" 
                label="To Date & Time" 
                required
                slotProps={{ inputLabel: { shrink: true } }} 
                value={formData.toDateTime} 
                onChange={(e) => handleChange('toDateTime', e.target.value)} 
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                size="small" 
                label="Task Title" 
                required
                value={formData.taskTitle} 
                onChange={(e) => handleChange('taskTitle', e.target.value)} 
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                size="small" 
                label="Task Description" 
                multiline 
                rows={4} 
                value={formData.taskDescription} 
                onChange={(e) => handleChange('taskDescription', e.target.value)} 
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select label="Priority" value={formData.priority} onChange={(e) => handleChange('priority', e.target.value as string)}>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {editTask && (
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select label="Status" value={formData.status} onChange={(e) => handleChange('status', e.target.value as string)}>
                    <MenuItem value="PENDING">PENDING</MenuItem>
                    <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                    <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default DailyTaskForm;
