import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export type ThemeMode = 'light' | 'dark' | 'custom';

export const getContrastTextColor = (hexcolor: string) => {
  hexcolor = hexcolor.replace("#", "");
  if (hexcolor.length === 3) {
    hexcolor = hexcolor.split('').map(c => c + c).join('');
  }
  const r = parseInt(hexcolor.substring(0, 2), 16) || 0;
  const g = parseInt(hexcolor.substring(2, 4), 16) || 0;
  const b = parseInt(hexcolor.substring(4, 6), 16) || 0;
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? '#1f2937' : '#ffffff';
};

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  sidebarColor: string;
  setSidebarColor: (color: string) => void;
  headerColor: string;
  setHeaderColor: (color: string) => void;
  statCardColor: string;
  setStatCardColor: (color: string) => void;
  mainCardColor: string;
  setMainCardColor: (color: string) => void;
  footerColor: string;
  setFooterColor: (color: string) => void;
  buttonColor: string;
  setButtonColor: (color: string) => void;
  tableColor: string;
  setTableColor: (color: string) => void;
  formColor: string;
  setFormColor: (color: string) => void;
  navMenuColor: string;
  setNavMenuColor: (color: string) => void;
  iconColor: string;
  setIconColor: (color: string) => void;
  linkColor: string;
  setLinkColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const useThemeContext = () => useContext(ThemeContext);

const NEU_LIGHT_BG = '#e0e5ec';
const NEU_DARK_BG = '#1c1f26';

const DEFAULT_LIGHT = {
  sidebarColor: '#2b303b',
  headerColor: NEU_LIGHT_BG,
  statCardColor: NEU_LIGHT_BG,
  mainCardColor: NEU_LIGHT_BG,
  footerColor: NEU_LIGHT_BG,
  buttonColor: '#059669',
  tableColor: NEU_LIGHT_BG,
  formColor: NEU_LIGHT_BG,
  navMenuColor: '#2b303b',
  iconColor: '#059669',
  linkColor: '#059669',
};

const DEFAULT_DARK = {
  sidebarColor: NEU_DARK_BG,
  headerColor: NEU_DARK_BG,
  statCardColor: NEU_DARK_BG,
  mainCardColor: NEU_DARK_BG,
  footerColor: NEU_DARK_BG,
  buttonColor: '#10b981',
  tableColor: NEU_DARK_BG,
  formColor: NEU_DARK_BG,
  navMenuColor: NEU_DARK_BG,
  iconColor: '#10b981',
  linkColor: '#10b981',
};

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => (localStorage.getItem('themeMode') as ThemeMode) || 'light');
  const [primaryColor, setPrimaryColorState] = useState<string>(() => localStorage.getItem('themeColor') || '#059669');
  
  const [sidebarColor, setSidebarColorState] = useState<string>(() => localStorage.getItem('sidebarColor') || '#2b303b');
  const [headerColor, setHeaderColorState] = useState<string>(() => localStorage.getItem('headerColor') || NEU_LIGHT_BG);
  const [statCardColor, setStatCardColorState] = useState<string>(() => localStorage.getItem('statCardColor') || NEU_LIGHT_BG);
  const [mainCardColor, setMainCardColorState] = useState<string>(() => localStorage.getItem('mainCardColor') || NEU_LIGHT_BG);
  const [footerColor, setFooterColorState] = useState<string>(() => localStorage.getItem('footerColor') || NEU_LIGHT_BG);
  
  const [buttonColor, setButtonColorState] = useState<string>(() => localStorage.getItem('buttonColor') || '#059669');
  const [tableColor, setTableColorState] = useState<string>(() => localStorage.getItem('tableColor') || NEU_LIGHT_BG);
  const [formColor, setFormColorState] = useState<string>(() => localStorage.getItem('formColor') || NEU_LIGHT_BG);
  const [navMenuColor, setNavMenuColorState] = useState<string>(() => localStorage.getItem('navMenuColor') || '#2b303b');
  const [iconColor, setIconColorState] = useState<string>(() => localStorage.getItem('iconColor') || '#059669');
  const [linkColor, setLinkColorState] = useState<string>(() => localStorage.getItem('linkColor') || '#059669');

  const setMode = (m: ThemeMode) => { setModeState(m); localStorage.setItem('themeMode', m); };
  const setPrimaryColor = (c: string) => { setPrimaryColorState(c); localStorage.setItem('themeColor', c); };
  
  const setSidebarColor = (c: string) => { setSidebarColorState(c); localStorage.setItem('sidebarColor', c); };
  const setHeaderColor = (c: string) => { setHeaderColorState(c); localStorage.setItem('headerColor', c); };
  const setStatCardColor = (c: string) => { setStatCardColorState(c); localStorage.setItem('statCardColor', c); };
  const setMainCardColor = (c: string) => { setMainCardColorState(c); localStorage.setItem('mainCardColor', c); };
  const setFooterColor = (c: string) => { setFooterColorState(c); localStorage.setItem('footerColor', c); };
  
  const setButtonColor = (c: string) => { setButtonColorState(c); localStorage.setItem('buttonColor', c); };
  const setTableColor = (c: string) => { setTableColorState(c); localStorage.setItem('tableColor', c); };
  const setFormColor = (c: string) => { setFormColorState(c); localStorage.setItem('formColor', c); };
  const setNavMenuColor = (c: string) => { setNavMenuColorState(c); localStorage.setItem('navMenuColor', c); };
  const setIconColor = (c: string) => { setIconColorState(c); localStorage.setItem('iconColor', c); };
  const setLinkColor = (c: string) => { setLinkColorState(c); localStorage.setItem('linkColor', c); };

  useEffect(() => {
    const isDark = mode === 'dark' || (mode === 'custom' && getContrastTextColor(mainCardColor) === '#ffffff');
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = NEU_DARK_BG;
      document.documentElement.style.setProperty('--color-background', NEU_DARK_BG);
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = NEU_LIGHT_BG;
      document.documentElement.style.setProperty('--color-background', NEU_LIGHT_BG);
    }
    
    const active = mode === 'light' ? DEFAULT_LIGHT : mode === 'dark' ? DEFAULT_DARK : {
      sidebarColor, headerColor, statCardColor, mainCardColor, footerColor, buttonColor, tableColor, formColor, navMenuColor, iconColor, linkColor
    };

    document.documentElement.style.setProperty('--color-primary', mode === 'custom' ? primaryColor : active.buttonColor);
    document.documentElement.style.setProperty('--color-sidebar-active', active.buttonColor);
    
    document.documentElement.style.setProperty('--color-sidebar', active.sidebarColor);
    document.documentElement.style.setProperty('--color-header', active.headerColor);
    document.documentElement.style.setProperty('--color-stat-card', active.statCardColor);
    document.documentElement.style.setProperty('--color-main-card', active.mainCardColor);
    document.documentElement.style.setProperty('--color-footer', active.footerColor);
    
    document.documentElement.style.setProperty('--color-button', active.buttonColor);
    document.documentElement.style.setProperty('--color-table', active.tableColor);
    document.documentElement.style.setProperty('--color-form', active.formColor);
    document.documentElement.style.setProperty('--color-nav-menu', active.navMenuColor);
    document.documentElement.style.setProperty('--color-icon', active.iconColor);
    document.documentElement.style.setProperty('--color-link', active.linkColor);
    
    // Automatically set text colors for variables
    document.documentElement.style.setProperty('--text-header', getContrastTextColor(active.headerColor));
    document.documentElement.style.setProperty('--text-stat-card', getContrastTextColor(active.statCardColor));
    document.documentElement.style.setProperty('--text-main-card', getContrastTextColor(active.mainCardColor));
    document.documentElement.style.setProperty('--text-sidebar', getContrastTextColor(active.sidebarColor));
    document.documentElement.style.setProperty('--text-button', getContrastTextColor(active.buttonColor));
    
  }, [mode, primaryColor, sidebarColor, headerColor, statCardColor, mainCardColor, footerColor, buttonColor, tableColor, formColor, navMenuColor, iconColor, linkColor]);

  const theme = useMemo(() => {
    const active = mode === 'light' ? DEFAULT_LIGHT : mode === 'dark' ? DEFAULT_DARK : {
      sidebarColor, headerColor, statCardColor, mainCardColor, footerColor, buttonColor, tableColor, formColor, navMenuColor, iconColor, linkColor
    };
    const isDark = mode === 'dark' || (mode === 'custom' && getContrastTextColor(active.mainCardColor) === '#ffffff');

    return createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: { main: active.buttonColor },
        background: {
          default: isDark ? '#121212' : '#f9fafb',
          paper: active.mainCardColor,
        },
        text: {
          primary: getContrastTextColor(active.mainCardColor),
        }
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        button: { textTransform: 'none', fontWeight: 600 },
      },
      shape: { borderRadius: 14 },
      components: {
        MuiButton: {
          defaultProps: { disableElevation: true },
          styleOverrides: {
            root: {
              borderRadius: '12px',
              padding: '8px 18px',
              fontWeight: 600,
              transition: 'box-shadow .18s ease, transform .08s ease, filter .18s ease',
            },
            contained: {
              backgroundColor: active.buttonColor,
              color: getContrastTextColor(active.buttonColor),
              boxShadow: 'var(--neu-out-sm)',
              '&:hover': { boxShadow: 'var(--neu-out)', filter: 'brightness(1.05)' },
              '&:active': { boxShadow: 'var(--neu-in-sm)', transform: 'translateY(1px)' },
            },
            outlined: {
              borderColor: 'transparent',
              color: getContrastTextColor(active.mainCardColor),
              backgroundColor: 'var(--neu-bg)',
              boxShadow: 'var(--neu-out-sm)',
              '&:hover': { borderColor: 'transparent', boxShadow: 'var(--neu-out)' },
              '&:active': { boxShadow: 'var(--neu-in-sm)', transform: 'translateY(1px)' },
            },
            text: {
              color: getContrastTextColor(active.mainCardColor),
              '&:hover': { backgroundColor: 'transparent', boxShadow: 'var(--neu-out-sm)' },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: 'var(--neu-out)',
              backgroundImage: 'none',
              borderRadius: '18px',
              backgroundColor: active.mainCardColor,
              color: getContrastTextColor(active.mainCardColor),
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              borderRadius: '12px',
              boxShadow: 'var(--neu-out-sm)',
              '&:active': { boxShadow: 'var(--neu-in-sm)' },
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              backgroundColor: 'transparent',
              color: getContrastTextColor(active.tableColor),
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(163,177,198,0.35)',
            },
            head: {
              fontWeight: 700,
              color: getContrastTextColor(active.tableColor),
            },
          },
        },
        MuiTableContainer: {
          styleOverrides: {
            root: { backgroundColor: 'transparent' },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              backgroundColor: 'var(--neu-bg)',
              borderRadius: '12px',
              boxShadow: 'var(--neu-in-sm)',
              transition: 'box-shadow .18s ease',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
              '&.Mui-focused': {
                boxShadow: `var(--neu-in-sm), 0 0 0 2px ${active.buttonColor}66`,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
                borderWidth: 0,
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              borderRadius: '12px',
            },
          },
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              color: getContrastTextColor(active.formColor),
            },
          },
        },
        MuiFormLabel: {
          styleOverrides: {
            root: {
              color: getContrastTextColor(active.formColor),
              opacity: 0.8,
            },
          },
        },
        MuiDataGrid: {
          styleOverrides: {
            root: {
              border: 'none',
              backgroundColor: 'transparent',
              borderRadius: '18px',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'transparent',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(163,177,198,0.35)',
              },
              '& .MuiDataGrid-cell': {
                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(163,177,198,0.25)',
              },
              '& .MuiDataGrid-footerContainer': { borderTop: 'none' },
            },
          },
        },
      },
    });
  }, [mode, sidebarColor, headerColor, statCardColor, mainCardColor, footerColor, buttonColor, tableColor, formColor, navMenuColor, iconColor, linkColor]);

  return (
    <ThemeContext.Provider value={{ 
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
    }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
