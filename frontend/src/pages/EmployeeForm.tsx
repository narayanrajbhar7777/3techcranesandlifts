import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Button, TextField, MenuItem, Checkbox, FormControlLabel, Select, InputLabel, FormControl, Grid, Paper, Typography, Box, IconButton, Dialog, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Save, UploadCloud, Trash2 } from 'lucide-react';
import { getEmployeeFormConfigs, getEmployees, getEmployee, createEmployee, updateEmployee, uploadDocument } from '../api/employeeApi';

const steps = ['Personal Details', 'Address', 'Documents'];

const FieldRow = ({ label, required, children }: { label: string, required?: boolean, children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <Box sx={{ width: 220, flexShrink: 0 }}>
      <Typography variant="body2" sx={{ textAlign: 'left', pr: 2, fontWeight: 500, color: 'text.primary' }}>
        {label}{required && <span style={{ color: 'red' }}>*</span>} :
      </Typography>
    </Box>
    <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
      {children}
    </Box>
  </Box>
);

const EmployeeForm = ({ employeeId, onComplete, onCancel }: { employeeId?: number | null, onComplete: () => void, onCancel: () => void }) => {
  const isEdit = !!employeeId;

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({ roles: [], departments: [], designations: [], employmentTypes: [], managers: [] });
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dynamicDocuments, setDynamicDocuments] = useState<{ type: string; url: string; originalName?: string; mimeType?: string; size?: number }[]>([]);
  const [documentType, setDocumentType] = useState('Aadhaar Card');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
    employeeCode: 'Auto Generated', name: '', nickName: '',
    mobileNo: '', emergencyContactNo: '', email: '', password: '',
    roleId: '', departmentId: '', designationId: '', employmentTypeId: '', reportingManagerId: '',
    currentStreet: '', currentPin: '', currentCity: '', currentDist: '', currentState: '', currentCountry: '',
    permanentStreet: '', permanentPin: '', permanentCity: '', permanentDist: '', permanentState: '', permanentCountry: '',
    dob: '', doj: '',
    photo: '',
    status: 'ACTIVE', isActive: true
  });

  useEffect(() => {
    // Fetch configs
    getEmployeeFormConfigs().then(data => setConfig(prev => ({ ...prev, ...data })));

    // Fetch managers (all employees)
    getEmployees(1, 1000).then(data => setConfig(prev => ({ ...prev, managers: data.data || [] })));

    if (isEdit && employeeId) {
      getEmployee(employeeId).then(data => {
        if (data.dob) data.dob = data.dob.split('T')[0];
        if (data.doj) data.doj = data.doj.split('T')[0];

        const docs: { type: string; url: string; originalName?: string; mimeType?: string; size?: number }[] = [];
        if (data.documents && Array.isArray(data.documents)) {
          data.documents.forEach((doc: any) => {
            docs.push({ 
              type: doc.documentName, 
              url: doc.documentPath,
              originalName: doc.originalName,
              mimeType: doc.mimeType,
              size: doc.size
            });
          });
        }
        
        if (data.address) {
          data.currentStreet = data.address.currentStreet || '';
          data.currentPin = data.address.currentPin || '';
          data.currentCity = data.address.currentCity || '';
          data.currentDist = data.address.currentDist || '';
          data.currentState = data.address.currentState || '';
          data.currentCountry = data.address.currentCountry || '';
          data.permanentStreet = data.address.permanentStreet || '';
          data.permanentPin = data.address.permanentPin || '';
          data.permanentCity = data.address.permanentCity || '';
          data.permanentDist = data.address.permanentDist || '';
          data.permanentState = data.address.permanentState || '';
          data.permanentCountry = data.address.permanentCountry || '';
        }

        setDynamicDocuments(docs);
        setFormData(data);
      });
    }
  }, [employeeId, isEdit]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: any) => {
    setSameAsPermanent(e.target.checked);
    if (e.target.checked) {
      setFormData((prev: any) => ({
        ...prev,
        currentStreet: prev.permanentStreet,
        currentPin: prev.permanentPin,
        currentCity: prev.permanentCity,
        currentDist: prev.permanentDist,
        currentState: prev.permanentState,
        currentCountry: prev.permanentCountry,
      }));
    }
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFileUpload = async (file: File, fieldName: string) => {
    try {
      const data = await uploadDocument(file);
      setFormData((prev: any) => ({ ...prev, [fieldName]: data.url }));
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const FileDropzone = ({ fieldName, label }: { fieldName: string, label: string }) => {
    const { getRootProps, getInputProps } = useDropzone({
      accept: { 'image/*': ['.jpeg', '.jpg', '.png'], 'application/pdf': ['.pdf'] },
      maxSize: 10485760, // 10MB
      onDrop: acceptedFiles => handleFileUpload(acceptedFiles[0], fieldName)
    });

    const fileUrl = formData[fieldName];
    const fullUrl = fileUrl ? (fileUrl.startsWith('http') ? fileUrl : `http://localhost:5000${fileUrl}`) : '';

    return (
      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', cursor: 'pointer', bgcolor: 'background.default' }} {...getRootProps()}>
        <input {...getInputProps()} />
        {!fileUrl && (
          <>
            <UploadCloud size={32} color="currentColor" style={{ margin: '0 auto', opacity: 0.6 }} />
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Drag & drop {label} or click to select
            </Typography>
          </>
        )}
        {fileUrl && (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }} onClick={(e) => { e.stopPropagation(); setPreviewUrl(fullUrl); }}>
            {fileUrl.toLowerCase().endsWith('.pdf') ? (
              <Typography variant="body2" color="primary" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: '2rem' }}>📄</span>
                PDF Document (Click to preview)
              </Typography>
            ) : (
              <img src={fullUrl} alt={label} style={{ width: '100%', maxHeight: 150, objectFit: 'contain' }} />
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Typography variant="caption" color="primary">File Uploaded</Typography>
              <Button size="small" color="error" onClick={(e) => { e.stopPropagation(); setFormData((prev: any) => ({ ...prev, [fieldName]: '' })) }}><Trash2 size={16} /></Button>
            </Box>
          </Box>
        )}
      </Paper>
    );
  };

  const handleDynamicFileUpload = async (file: File) => {
    try {
      const data = await uploadDocument(file);
      setDynamicDocuments((prev) => [...prev, { 
        type: documentType, 
        url: data.url,
        originalName: data.originalName,
        mimeType: data.mimeType,
        size: data.size
      }]);
      setDocumentType('Aadhaar Card');
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.email) newErrors.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.mobileNo) newErrors.mobileNo = 'Required';
    if (!formData.emergencyContactNo) newErrors.emergencyContactNo = 'Required';
    if (!formData.roleId) newErrors.roleId = 'Required';
    if (!formData.departmentId) newErrors.departmentId = 'Required';
    if (!formData.designationId) newErrors.designationId = 'Required';
    if (!formData.employmentTypeId) newErrors.employmentTypeId = 'Required';
    if (!formData.dob) newErrors.dob = 'Required';
    if (!formData.doj) newErrors.doj = 'Required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setActiveStep(0);
      return false;
    }
    return true;
  };

  const handleSubmit = async (status: string = 'ACTIVE') => {
    if (status !== 'DRAFT' && !validateForm()) {
      alert('Please fill all required fields correctly.');
      return;
    }
    setLoading(true);
    const mappedPayload = { ...formData, status };
    
    // Map dynamic documents to backend format
    mappedPayload.documents = dynamicDocuments.map(doc => ({
      documentName: doc.type,
      documentPath: doc.url,
      originalName: doc.originalName || '',
      mimeType: doc.mimeType || '',
      size: doc.size || 0
    }));

    try {
      if (isEdit && employeeId) {
        await updateEmployee(employeeId, mappedPayload);
      } else {
        await createEmployee(mappedPayload);
      }
      onComplete();
    } catch (err: any) {
      console.error(err);
      alert('Error saving employee: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box component="header" sx={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, bgcolor: 'var(--color-header)', borderBottom: 1, borderColor: 'divider', boxShadow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onCancel} sx={{ color: 'text.secondary' }}><ArrowLeft size={20} /></IconButton>
          <Typography variant="h6" fontWeight="bold" color="text.primary">{isEdit ? 'Edit' : 'Add'} Employee</Typography>
        </Box>
        <div className="flex space-x-3">
          <Button variant="outlined" disabled={loading} onClick={() => handleSubmit('DRAFT')}>Save Draft</Button>
          <Button variant="contained" disabled={loading} onClick={() => handleSubmit(formData.status)} startIcon={<Save size={16} />}>
            {loading ? 'Saving...' : 'Save Employee'}
          </Button>
        </div>
      </Box>

      <Box component="main" sx={{ flex: 1, overflowY: 'auto', p: 4, bgcolor: 'background.default' }}>
        <Paper sx={{ p: 4, width: '100%', mx: 'auto', minHeight: 'calc(100vh - 128px)', bgcolor: 'var(--color-main-card)' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs value={activeStep} onChange={(e, val) => setActiveStep(val)} variant="scrollable" scrollButtons="auto">
              {steps.map((label, index) => (
                <Tab key={label} label={label} value={index} sx={{ textTransform: 'none', fontWeight: 'bold' }} />
              ))}
            </Tabs>
          </Box>

          {/* Step 1: Personal Details */}
          {activeStep === 0 && (
            <Box sx={{ maxWidth: 800 }}>
              <FieldRow label="Employee Code">
                <TextField fullWidth size="small" name="employeeCode" value={formData.employeeCode} disabled />
              </FieldRow>
              <FieldRow label="Full Name" required>
                <TextField fullWidth size="small" name="name" value={formData.name} onChange={handleChange} required error={!!errors.name} helperText={errors.name} />
              </FieldRow>
              <FieldRow label="Nick Name">
                <TextField fullWidth size="small" name="nickName" value={formData.nickName} onChange={handleChange} />
              </FieldRow>
              <FieldRow label="Email" required>
                <TextField fullWidth size="small" type="email" name="email" value={formData.email} onChange={handleChange} required error={!!errors.email} helperText={errors.email} />
              </FieldRow>
              <FieldRow label="Mobile No" required>
                <TextField fullWidth size="small" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required error={!!errors.mobileNo} helperText={errors.mobileNo} />
              </FieldRow>
              <FieldRow label="Emergency Contact" required>
                <TextField fullWidth size="small" name="emergencyContactNo" value={formData.emergencyContactNo} onChange={handleChange} required error={!!errors.emergencyContactNo} helperText={errors.emergencyContactNo} />
              </FieldRow>
              <FieldRow label="Role" required>
                <Select fullWidth size="small" name="roleId" value={formData.roleId || ''} onChange={handleChange} displayEmpty error={!!errors.roleId}>
                  <MenuItem value="" disabled><em>Select Role</em></MenuItem>
                  {config.roles.map((r: any) => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
                </Select>
                {errors.roleId && <Typography variant="caption" color="error">{errors.roleId}</Typography>}
              </FieldRow>
              <FieldRow label="Department" required>
                <Select fullWidth size="small" name="departmentId" value={formData.departmentId || ''} onChange={handleChange} displayEmpty error={!!errors.departmentId}>
                  <MenuItem value="" disabled><em>Select Department</em></MenuItem>
                  {config.departments.map((d: any) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                </Select>
                {errors.departmentId && <Typography variant="caption" color="error">{errors.departmentId}</Typography>}
              </FieldRow>
              <FieldRow label="Designation" required>
                <Select fullWidth size="small" name="designationId" value={formData.designationId || ''} onChange={handleChange} displayEmpty error={!!errors.designationId}>
                  <MenuItem value="" disabled><em>Select Designation</em></MenuItem>
                  {config.designations.map((d: any) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                </Select>
                {errors.designationId && <Typography variant="caption" color="error">{errors.designationId}</Typography>}
              </FieldRow>
              <FieldRow label="Employment Type" required>
                <Select fullWidth size="small" name="employmentTypeId" value={formData.employmentTypeId || ''} onChange={handleChange} displayEmpty error={!!errors.employmentTypeId}>
                  <MenuItem value="" disabled><em>Select Employment Type</em></MenuItem>
                  {config.employmentTypes.map((et: any) => <MenuItem key={et.id} value={et.id}>{et.name}</MenuItem>)}
                </Select>
                {errors.employmentTypeId && <Typography variant="caption" color="error">{errors.employmentTypeId}</Typography>}
              </FieldRow>
              <FieldRow label="Reporting Manager">
                <Select fullWidth size="small" name="reportingManagerId" value={formData.reportingManagerId || ''} onChange={handleChange} displayEmpty>
                  <MenuItem value="" disabled><em>None</em></MenuItem>
                  {config.managers.map((m: any) => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
                </Select>
              </FieldRow>
              <FieldRow label="Date of Birth" required>
                <TextField fullWidth size="small" type="date" name="dob" value={formData.dob} onChange={handleChange} required error={!!errors.dob} helperText={errors.dob} slotProps={{ inputLabel: { shrink: true } }} />
              </FieldRow>
              <FieldRow label="Date of Joining" required>
                <TextField fullWidth size="small" type="date" name="doj" value={formData.doj} onChange={handleChange} required error={!!errors.doj} helperText={errors.doj} slotProps={{ inputLabel: { shrink: true } }} />
              </FieldRow>
            </Box>
          )}

          {/* Step 2: Address */}
          {activeStep === 1 && (
            <Box sx={{ maxWidth: 1200 }}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 3, borderBottom: 1, borderColor: 'divider', pb: 1 }}>Permanent Address</Typography>
                  <FieldRow label="Street">
                    <TextField fullWidth size="small" name="permanentStreet" value={formData.permanentStreet} onChange={handleChange} />
                  </FieldRow>
                  <FieldRow label="City">
                    <TextField fullWidth size="small" name="permanentCity" value={formData.permanentCity} onChange={handleChange} />
                  </FieldRow>
                  <FieldRow label="Pin Code">
                    <TextField fullWidth size="small" name="permanentPin" value={formData.permanentPin} onChange={handleChange} />
                  </FieldRow>
                  <FieldRow label="District">
                    <TextField fullWidth size="small" name="permanentDist" value={formData.permanentDist} onChange={handleChange} />
                  </FieldRow>
                  <FieldRow label="State">
                    <TextField fullWidth size="small" name="permanentState" value={formData.permanentState} onChange={handleChange} />
                  </FieldRow>
                  <FieldRow label="Country">
                    <TextField fullWidth size="small" name="permanentCountry" value={formData.permanentCountry} onChange={handleChange} />
                  </FieldRow>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                    <Typography variant="h6">Current Address</Typography>
                    <FormControlLabel control={<Checkbox checked={sameAsPermanent} onChange={handleCheckboxChange} size="small" />} label="Same as Permanent" />
                  </Box>
                  <FieldRow label="Street">
                    <TextField fullWidth size="small" name="currentStreet" value={formData.currentStreet} onChange={handleChange} disabled={sameAsPermanent} />
                  </FieldRow>
                  <FieldRow label="City">
                    <TextField fullWidth size="small" name="currentCity" value={formData.currentCity} onChange={handleChange} disabled={sameAsPermanent} />
                  </FieldRow>
                  <FieldRow label="Pin Code">
                    <TextField fullWidth size="small" name="currentPin" value={formData.currentPin} onChange={handleChange} disabled={sameAsPermanent} />
                  </FieldRow>
                  <FieldRow label="District">
                    <TextField fullWidth size="small" name="currentDist" value={formData.currentDist} onChange={handleChange} disabled={sameAsPermanent} />
                  </FieldRow>
                  <FieldRow label="State">
                    <TextField fullWidth size="small" name="currentState" value={formData.currentState} onChange={handleChange} disabled={sameAsPermanent} />
                  </FieldRow>
                  <FieldRow label="Country">
                    <TextField fullWidth size="small" name="currentCountry" value={formData.currentCountry} onChange={handleChange} disabled={sameAsPermanent} />
                  </FieldRow>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Step 3: Documents */}
          {activeStep === 2 && (
            <Box sx={{ width: '100%' }}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 3, borderBottom: 1, borderColor: 'divider', pb: 1 }}>Employee Photo</Typography>
                  <Box sx={{ mb: 4 }}>
                    <FileDropzone fieldName="photo" label="Employee Photo" />
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ mb: 3, borderBottom: 1, borderColor: 'divider', pb: 1 }}>Add Document</Typography>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Document Name (e.g. Aadhaar Card, 10th Marksheet)"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      sx={{ mb: 2 }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{ flex: 1, textTransform: 'none' }}
                      >
                        {pendingFile ? pendingFile.name : 'Select File'}
                        <input
                          type="file"
                          hidden
                          accept=".jpeg,.jpg,.png,.pdf"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setPendingFile(e.target.files[0]);
                            }
                          }}
                        />
                      </Button>
                      <Button
                        variant="contained"
                        disabled={!pendingFile || loading}
                        onClick={async () => {
                          if (pendingFile) {
                            setLoading(true);
                            await handleDynamicFileUpload(pendingFile);
                            setPendingFile(null);
                            setLoading(false);
                          }
                        }}
                      >
                        Add
                      </Button>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 3, borderBottom: 1, borderColor: 'divider', pb: 1 }}>Uploaded Documents</Typography>
                  {dynamicDocuments.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No documents added yet.</Typography>
                  ) : (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell width={80}><strong>Sr. No.</strong></TableCell>
                            <TableCell><strong>Document Name</strong></TableCell>
                            <TableCell><strong>File</strong></TableCell>
                            <TableCell><strong>Size</strong></TableCell>
                            <TableCell width={60} align="center"><strong>Action</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dynamicDocuments.map((doc, idx) => {
                            const filename = doc.originalName || (doc.url.split('/').pop() || 'document');
                            const fullUrl = doc.url.startsWith('http') ? doc.url : `http://localhost:5000${doc.url}`;
                            const sizeText = doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : 'N/A';
                            
                            return (
                              <TableRow key={idx} hover>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>{doc.type}</TableCell>
                                <TableCell>
                                  <Button size="small" variant="text" onClick={() => setPreviewUrl(fullUrl)} sx={{ textTransform: 'none' }}>
                                    {filename}
                                  </Button>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary">{sizeText}</Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton size="small" color="error" onClick={() => setDynamicDocuments(prev => prev.filter((_, i) => i !== idx))}>
                                    <Trash2 size={16} />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button onClick={() => handleSubmit(formData.status)} variant="contained" color="success" size="large">Save & Finish</Button>
          </Box>
        </Paper>
      </Box>

      <Dialog open={!!previewUrl} onClose={() => setPreviewUrl(null)} maxWidth="md" fullWidth>
        <Box sx={{ p: 2, position: 'relative', bgcolor: '#f5f5f5', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {previewUrl?.toLowerCase().endsWith('.pdf') ? (
            <iframe src={previewUrl} width="100%" height="600px" style={{ border: 'none' }} title="PDF Preview" />
          ) : (
            <img src={previewUrl || ''} alt="Preview" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
          )}
          <Button variant="contained" color="inherit" onClick={() => setPreviewUrl(null)} sx={{ position: 'absolute', top: 16, right: 16 }}>Close</Button>
        </Box>
      </Dialog>
    </>
  );
};

export default EmployeeForm;
