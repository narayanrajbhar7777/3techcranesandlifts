import React, { useState } from 'react';
import { Box, IconButton, Drawer, Typography, Divider, Button } from '@mui/material';
import { Settings, Moon, Sun, Palette } from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';

const PRESET_COLORS = [
  '#059669', // Default Green
  '#2563eb', // Blue
  '#7c3aed', // Purple
  '#db2777', // Pink
  '#ea580c', // Orange
];

const ThemeSettings = () => {
  const [open, setOpen] = useState(false);
  const { 
    mode, setMode, 
    primaryColor, setPrimaryColor, 
    sidebarColor, setSidebarColor, 
    headerColor, setHeaderColor, 
    statCardColor, setStatCardColor, 
    mainCardColor, setMainCardColor, 
    footerColor, setFooterColor,
    buttonColor, setButtonColor,
    tableColor, setTableColor,
    formColor, setFormColor,
    navMenuColor, setNavMenuColor,
    iconColor, setIconColor,
    linkColor, setLinkColor
  } = useThemeContext();

  return (
    <>
      <IconButton 
        onClick={() => setOpen(true)}
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24, 
          bgcolor: 'var(--color-button, var(--color-primary))', 
          color: 'white',
          boxShadow: 3,
          '&:hover': { opacity: 0.9 }
        }}
      >
        <Settings size={24} />
      </IconButton>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 340, p: 3, bgcolor: 'background.paper', height: '100%' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">Theme Settings</Typography>
          <Divider sx={{ mb: 3 }} />

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Mode</Typography>
          <Box display="flex" gap={1} mb={4}>
            <Button 
              variant={mode === 'light' ? 'contained' : 'outlined'} 
              startIcon={<Sun size={16} />}
              onClick={() => setMode('light')}
              fullWidth
              size="small"
            >
              Light
            </Button>
            <Button 
              variant={mode === 'dark' ? 'contained' : 'outlined'} 
              startIcon={<Moon size={16} />}
              onClick={() => setMode('dark')}
              fullWidth
              size="small"
            >
              Dark
            </Button>
            <Button 
              variant={mode === 'custom' ? 'contained' : 'outlined'} 
              startIcon={<Palette size={16} />}
              onClick={() => setMode('custom')}
              fullWidth
              size="small"
            >
              Custom
            </Button>
          </Box>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Primary Accent Color</Typography>
          <Box display="flex" gap={2} flexWrap="wrap" mb={mode === 'custom' ? 1 : 4}>
            {PRESET_COLORS.map(color => (
              <Box 
                key={color}
                onClick={() => setPrimaryColor(color)}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: color,
                  cursor: 'pointer',
                  border: primaryColor === color ? '3px solid #111827' : '3px solid transparent',
                  outline: primaryColor === color ? `2px solid ${color}` : 'none',
                  transition: 'all 0.2s',
                  ...(mode === 'dark' && primaryColor === color ? { border: '3px solid #ffffff' } : {})
                }}
              />
            ))}
          </Box>
          
          {mode === 'custom' && (
            <Typography variant="caption" color="text.secondary" display="block" mb={4}>
              Applies globally when Custom mode is selected.
            </Typography>
          )}

          {mode === 'custom' && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Component Colors</Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.primary">Sidebar</Typography>
                  <input type="color" value={sidebarColor} onChange={(e) => setSidebarColor(e.target.value)} style={{ cursor: 'pointer', border: 'none', width: 40, height: 40, padding: 0, borderRadius: 4 }} />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.primary">Header</Typography>
                  <input type="color" value={headerColor} onChange={(e) => setHeaderColor(e.target.value)} style={{ cursor: 'pointer', border: 'none', width: 40, height: 40, padding: 0, borderRadius: 4 }} />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.primary">Stat Cards</Typography>
                  <input type="color" value={statCardColor} onChange={(e) => setStatCardColor(e.target.value)} style={{ cursor: 'pointer', border: 'none', width: 40, height: 40, padding: 0, borderRadius: 4 }} />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.primary">Main Content / Cards</Typography>
                  <input type="color" value={mainCardColor} onChange={(e) => setMainCardColor(e.target.value)} style={{ cursor: 'pointer', border: 'none', width: 40, height: 40, padding: 0, borderRadius: 4 }} />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.primary">Footer</Typography>
                  <input type="color" value={footerColor} onChange={(e) => setFooterColor(e.target.value)} style={{ cursor: 'pointer', border: 'none', width: 40, height: 40, padding: 0, borderRadius: 4 }} />
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.primary">Buttons</Typography>
                  <input type="color" value={buttonColor} onChange={(e) => setButtonColor(e.target.value)} style={{ cursor: 'pointer', border: 'none', width: 40, height: 40, padding: 0, borderRadius: 4 }} />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.primary">Tables</Typography>
                  <input type="color" value={tableColor} onChange={(e) => setTableColor(e.target.value)} style={{ cursor: 'pointer', border: 'none', width: 40, height: 40, padding: 0, borderRadius: 4 }} />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.primary">Forms / Inputs</Typography>
                  <input type="color" value={formColor} onChange={(e) => setFormColor(e.target.value)} style={{ cursor: 'pointer', border: 'none', width: 40, height: 40, padding: 0, borderRadius: 4 }} />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.primary">Navigation Menu</Typography>
                  <input type="color" value={navMenuColor} onChange={(e) => setNavMenuColor(e.target.value)} style={{ cursor: 'pointer', border: 'none', width: 40, height: 40, padding: 0, borderRadius: 4 }} />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.primary">Icons</Typography>
                  <input type="color" value={iconColor} onChange={(e) => setIconColor(e.target.value)} style={{ cursor: 'pointer', border: 'none', width: 40, height: 40, padding: 0, borderRadius: 4 }} />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.primary">Links</Typography>
                  <input type="color" value={linkColor} onChange={(e) => setLinkColor(e.target.value)} style={{ cursor: 'pointer', border: 'none', width: 40, height: 40, padding: 0, borderRadius: 4 }} />
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default ThemeSettings;
