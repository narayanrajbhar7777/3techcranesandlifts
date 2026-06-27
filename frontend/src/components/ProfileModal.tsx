import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Tabs, Tab, Box, Typography } from '@mui/material';
import { getMyProfile, updateMyProfile, changePassword, uploadProfilePicture } from '../api/userApi';
import { API_BASE_URL } from '../constants';

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profileData, setProfileData] = useState<any>(null);
  const [username, setUsername] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    getMyProfile()
      .then((data: any) => {
        setProfileData(data);
        setUsername(data.username);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      await updateMyProfile({ username });
      
      // Update local storage if needed
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        u.username = username;
        localStorage.setItem('user', JSON.stringify(u));
      }
      
      alert('Profile updated successfully');
    } catch (err: any) {
      alert(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return alert('Passwords do not match');
    }
    try {
      setSaving(true);
      await changePassword({ currentPassword, newPassword });
      alert('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      alert(err.message || 'Error changing password');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadPicture = async () => {
    if (!file) return;
    try {
      setSaving(true);
      const res = await uploadProfilePicture(file);
      setProfileData({ ...profileData, profilePicture: res.url });
      
      // Update local storage if needed
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        u.profilePicture = res.url;
        localStorage.setItem('user', JSON.stringify(u));
      }
      
      alert('Profile picture uploaded successfully');
      setFile(null);
    } catch (err: any) {
      alert(err.message || 'Error uploading picture');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent className="flex justify-center items-center py-12">
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  const picUrl = profileData?.profilePicture ? 
    (profileData.profilePicture.startsWith('http') ? profileData.profilePicture : `${API_BASE_URL.replace('/api', '')}${profileData.profilePicture}`) 
    : null;

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>My Profile Settings</DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth">
          <Tab label="Profile" />
          <Tab label="Security" />
        </Tabs>
      </Box>

      <DialogContent dividers className="space-y-6">
        {tab === 0 && (
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-4 border-white shadow-md">
                {picUrl ? (
                  <img src={picUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl text-gray-400 font-bold">{username.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input type="file" accept="image/*" onChange={(e) => e.target.files && setFile(e.target.files[0])} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                {file && <Button variant="contained" size="small" onClick={handleUploadPicture} disabled={saving}>Upload</Button>}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <Typography variant="subtitle2" color="textSecondary">Account Details</Typography>
              <TextField 
                fullWidth size="small" 
                label="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
              <TextField 
                fullWidth size="small" 
                label="Role" 
                value={profileData?.role || ''} 
                disabled 
              />
              
              {profileData?.employee && (
                <>
                  <Typography variant="subtitle2" color="textSecondary" className="pt-4">Employee Details</Typography>
                  <TextField fullWidth size="small" label="Full Name" value={profileData.employee.name} disabled />
                  <TextField fullWidth size="small" label="Email" value={profileData.employee.email} disabled />
                  <TextField fullWidth size="small" label="Department" value={profileData.employee.department?.name || ''} disabled />
                  <TextField fullWidth size="small" label="Designation" value={profileData.employee.designation?.name || ''} disabled />
                </>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="contained" color="primary" onClick={handleUpdateProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className="space-y-4">
            <Typography variant="subtitle2" color="textSecondary">Change Password</Typography>
            <TextField 
              fullWidth size="small" type="password" 
              label="Current Password" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
            />
            <TextField 
              fullWidth size="small" type="password" 
              label="New Password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
            />
            <TextField 
              fullWidth size="small" type="password" 
              label="Confirm New Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            <div className="flex justify-end pt-4">
              <Button variant="contained" color="primary" onClick={handleChangePassword} disabled={saving}>
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
