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

const DEFAULT_LIGHT = {
  sidebarColor: '#064e3b',
  headerColor: '#ffffff',
  statCardColor: '#ffffff',
  mainCardColor: '#ffffff',
  footerColor: '#ffffff',
  buttonColor: '#059669',
  tableColor: '#ffffff',
  formColor: '#ffffff',
  navMenuColor: '#064e3b',
  iconColor: '#059669',
  linkColor: '#059669',
};

const DEFAULT_DARK = {
  sidebarColor: '#121212',
  headerColor: '#1e1e1e',
  statCardColor: '#1e1e1e',
  mainCardColor: '#1e1e1e',
  footerColor: '#1e1e1e',
  buttonColor: '#10b981',
  tableColor: '#1e1e1e',
  formColor: '#1e1e1e',
  navMenuColor: '#121212',
  iconColor: '#10b981',
  linkColor: '#10b981',
};

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => (localStorage.getItem('themeMode') as ThemeMode) || 'light');
  const [primaryColor, setPrimaryColorState] = useState<string>(() => localStorage.getItem('themeColor') || '#059669');
  
  const [sidebarColor, setSidebarColorState] = useState<string>(() => localStorage.getItem('sidebarColor') || '#064e3b');
  const [headerColor, setHeaderColorState] = useState<string>(() => localStorage.getItem('headerColor') || '#ffffff');
  const [statCardColor, setStatCardColorState] = useState<string>(() => localStorage.getItem('statCardColor') || '#ffffff');
  const [mainCardColor, setMainCardColorState] = useState<string>(() => localStorage.getItem('mainCardColor') || '#ffffff');
  const [footerColor, setFooterColorState] = useState<string>(() => localStorage.getItem('footerColor') || '#ffffff');
  
  const [buttonColor, setButtonColorState] = useState<string>(() => localStorage.getItem('buttonColor') || '#059669');
  const [tableColor, setTableColorState] = useState<string>(() => localStorage.getItem('tableColor') || '#ffffff');
  const [formColor, setFormColorState] = useState<string>(() => localStorage.getItem('formColor') || '#ffffff');
  const [navMenuColor, setNavMenuColorState] = useState<string>(() => localStorage.getItem('navMenuColor') || '#064e3b');
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
      document.body.style.backgroundColor = '#121212';
      document.documentElement.style.setProperty('--color-background', '#121212');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f9fafb';
      document.documentElement.style.setProperty('--color-background', '#f9fafb');
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
      shape: { borderRadius: 8 },
      components: {
        MuiButton: {
          styleOverrides: {
            root: { borderRadius: '8px', padding: '8px 16px' },
            contained: { backgroundColor: active.buttonColor, color: getContrastTextColor(active.buttonColor) },
            outlined: { borderColor: active.buttonColor, color: active.buttonColor }
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: isDark ? 'none' : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              backgroundImage: 'none',
              borderRadius: '12px',
              backgroundColor: active.mainCardColor,
              color: getContrastTextColor(active.mainCardColor),
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              backgroundColor: active.tableColor,
              color: getContrastTextColor(active.tableColor),
              borderColor: isDark ? '#333' : '#e5e7eb',
            }
          }
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              backgroundColor: active.formColor,
              borderRadius: '8px',
            }
          }
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              color: getContrastTextColor(active.formColor),
            }
          }
        },
        MuiFormLabel: {
          styleOverrides: {
            root: {
              color: getContrastTextColor(active.formColor),
              opacity: 0.8,
            }
          }
        }
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
