import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Chip, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, InputAdornment } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { MoreVertical, Plus, FileSpreadsheet, FileText, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getEmployees, updateEmployeeStatus, deleteEmployee } from '../api/employeeApi';
import type { Employee } from '../types';
import HeaderProfileMenu from '../components/HeaderProfileMenu';

const EmployeeList = ({ onAddNew, onEdit }: { onAddNew: () => void, onEdit: (id: number) => void }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Actions Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Dialog State
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchEmployeesList = async () => {
    setLoading(true);
    try {
      const data = await getEmployees(page + 1, rowsPerPage, search);
      setEmployees(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesList();
  }, [page, rowsPerPage, search]);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleStatusToggle = async (currentStatus: boolean) => {
    if (!selectedId) return;
    try {
      await updateEmployeeStatus(selectedId, !currentStatus);
      fetchEmployeesList();
    } catch (err) {
      console.error(err);
    }
    handleMenuClose();
  };

  const handleDeleteEmployee = async () => {
    if (!selectedId) return;
    try {
      await deleteEmployee(selectedId);
      fetchEmployeesList();
      setDeleteOpen(false);
    } catch (err) {
      console.error(err);
    }
    handleMenuClose();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(employees.map(e => ({
      Code: e.employeeCode,
      Name: e.name,
      Email: e.email,
      Mobile: e.mobileNo,
      Status: e.status,
      Active: e.isActive ? 'Yes' : 'No'
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "Employees.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Code", "Name", "Email", "Role", "Department"];
    const tableRows: any[] = [];

    employees.forEach(e => {
      tableRows.push([
        e.employeeCode,
        e.name,
        e.email,
        e.role?.name || 'N/A',
        e.department?.name || 'N/A'
      ]);
    });

    // Use autoTable plugin correctly
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.text("Employee Report", 14, 15);
    doc.save("Employees.pdf");
  };

  const columns: GridColDef[] = [
    { field: 'photo', headerName: 'Photo', width: 80, renderCell: (params: GridRenderCellParams) => {
      let imageUrl = params.value;
      if (imageUrl && imageUrl.startsWith('/uploads')) {
        imageUrl = `http://localhost:5000${imageUrl}`;
      }
      
      const initials = params.row.name ? params.row.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
      
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
          <img 
            src={imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(params.row.name)}&background=random`} 
            alt="Avatar" 
            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top center', border: '1px solid #e5e7eb' }} 
          />
        </Box>
      );
    }},
    { field: 'employeeCode', headerName: 'Code', width: 120 },
    { field: 'name', headerName: 'Full Name', width: 180 },
    { field: 'nickName', headerName: 'Nick Name', width: 130 },
    { field: 'employmentType', headerName: 'Type', width: 120, valueGetter: (value: any, row: any) => row.employmentType?.name || 'N/A' },
    { field: 'mobileNo', headerName: 'Mobile', width: 140 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'department', headerName: 'Department', width: 150, valueGetter: (value: any, row: any) => row.department?.name || 'N/A' },
    { field: 'designation', headerName: 'Designation', width: 180, valueGetter: (value: any, row: any) => row.designation?.name || 'N/A' },
    { field: 'role', headerName: 'Role', width: 130, valueGetter: (value: any, row: any) => row.role?.name || 'N/A' },
    { field: 'reportingManager', headerName: 'Manager', width: 150, valueGetter: (value: any, row: any) => row.reportingManager?.name || 'N/A' },
    { field: 'doj', headerName: 'Date of Joining', width: 140, valueFormatter: (params: any) => new Date(params).toLocaleDateString() },
    { field: 'isActive', headerName: 'Status', width: 120, renderCell: (params: GridRenderCellParams) => (
      <Chip 
        label={params.row.status === 'DRAFT' ? 'Draft' : params.value ? 'Active' : 'Inactive'} 
        color={params.row.status === 'DRAFT' ? 'warning' : params.value ? 'success' : 'error'} 
        size="small" 
      />
    )},
    { field: 'createdAt', headerName: 'Created Date', width: 140, type: 'date', valueGetter: (value: any, row: any) => row.createdAt ? new Date(row.createdAt) : null },
    { field: 'updatedAt', headerName: 'Updated Date', width: 140, type: 'date', valueGetter: (value: any, row: any) => row.updatedAt ? new Date(row.updatedAt) : null },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton onClick={(e) => handleMenuClick(e, params.row.id as number)}>
          <MoreVertical size={18} />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Box component="header" sx={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, bgcolor: 'var(--color-header)', borderBottom: 1, borderColor: 'divider', boxShadow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="text.primary">Employee Overview</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField 
            placeholder="Search Employee..." 
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={18} className="text-gray-400" /></InputAdornment> } }}
            sx={{ width: 250, '& fieldset': { borderColor: 'divider' }, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <Button variant="outlined" startIcon={<FileSpreadsheet size={18} />} onClick={exportExcel}>Excel</Button>
          <Button variant="outlined" startIcon={<FileText size={18} />} onClick={exportPDF}>PDF</Button>
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={onAddNew}>
            Add Employee
          </Button>
          <Box sx={{ borderLeft: 1, borderColor: 'divider', height: 32, mx: 1 }} />
          <HeaderProfileMenu />
        </Box>
      </Box>
      <Box component="main" sx={{ flex: 1, p: 3, bgcolor: 'background.default', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <Box sx={{ flex: 1, width: '100%', bgcolor: 'var(--color-main-card)', borderRadius: 2, boxShadow: 1, p: 0, overflow: 'hidden' }}>
          <DataGrid
            rows={employees}
            columns={columns}
            loading={loading}
            paginationMode="server"
            rowCount={total}
            pageSizeOptions={[15, 20, 50, 100]}
            paginationModel={{ page, pageSize: rowsPerPage }}
            onPaginationModelChange={(model) => {
              setPage(model.page);
              setRowsPerPage(model.pageSize);
            }}
            slots={{ toolbar: GridToolbar }}
            onRowDoubleClick={(params) => onEdit(params.row.id as number)}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
              '& .MuiDataGrid-row:hover': { backgroundColor: 'action.hover', cursor: 'pointer' },
              '& .MuiDataGrid-columnHeaders': { bgcolor: 'background.default' },
            }}
          />
        </Box>

          {/* Action Menu */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => { if(selectedId) onEdit(selectedId); handleMenuClose(); }}>Edit Employee</MenuItem>
            <MenuItem onClick={() => {
              const emp = employees.find(e => e.id === selectedId);
              if (emp) handleStatusToggle(emp.isActive);
            }}>
              {employees.find(e => e.id === selectedId)?.isActive ? 'Deactivate' : 'Activate'}
            </MenuItem>
            <MenuItem onClick={() => { setDeleteOpen(true); handleMenuClose(); }} sx={{ color: 'error.main' }}>Delete</MenuItem>
          </Menu>

          {/* Delete Dialog */}
          <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>Are you sure you want to delete this employee? This action cannot be undone.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteEmployee} color="error" variant="contained">Delete</Button>
            </DialogActions>
          </Dialog>
      </Box>
    </>
  );
};

export default EmployeeList;
