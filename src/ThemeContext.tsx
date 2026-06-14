import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ThemeName = 'cyber' | 'spotify' | 'light' | 'ocean' | 'paper';

export interface Theme {
  name: ThemeName;
  label: string;
  colors: {
    bg: string;
    card: string;
    border: string;
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    text: string;
    muted: string;
  };
}

export const themes: Record<ThemeName, Theme> = {
  cyber: {
    name: 'cyber',
    label: 'Cyber',
    colors: {
      bg: '#0B1020',
      card: '#121A30',
      border: '#1E2D50',
      primary: '#00E5FF',
      secondary: '#7B61FF',
      success: '#00C853',
      warning: '#FFC107',
      danger: '#FF5252',
      text: '#E0E0E0',
      muted: '#8899AA',
    },
  },
  spotify: {
    name: 'spotify',
    label: 'Spotify Dark',
    colors: {
      bg: '#121212',
      card: '#181818',
      border: '#282828',
      primary: '#1DB954',
      secondary: '#1ED760',
      success: '#1DB954',
      warning: '#F59B23',
      danger: '#E22134',
      text: '#FFFFFF',
      muted: '#B3B3B3',
    },
  },
  light: {
    name: 'light',
    label: 'Light',
    colors: {
      bg: '#F5F5F5',
      card: '#FFFFFF',
      border: '#E0E0E0',
      primary: '#1A73E8',
      secondary: '#6750A4',
      success: '#34A853',
      warning: '#FBBC04',
      danger: '#EA4335',
      text: '#202124',
      muted: '#5F6368',
    },
  },
  ocean: {
    name: 'ocean',
    label: 'Ocean',
    colors: {
      bg: '#0A1628',
      card: '#111D32',
      border: '#1A3050',
      primary: '#29B6F6',
      secondary: '#00BFA5',
      success: '#66BB6A',
      warning: '#FFA726',
      danger: '#EF5350',
      text: '#B0C4DE',
      muted: '#6E8B9E',
    },
  },
  paper: {
    name: 'paper',
    label: 'Paper',
    colors: {
      bg: '#EDE8E0',
      card: '#F5F0E8',
      border: '#D4CFC7',
      primary: '#5C6BC0',
      secondary: '#8D6E63',
      success: '#43A047',
      warning: '#E68A00',
      danger: '#D32F2F',
      text: '#2C2C2C',
      muted: '#6D6660',
    },
  },
};

const STORAGE_KEY = 'e8-theme';

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: themes.cyber,
  themeName: 'cyber',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved in themes) return saved as ThemeName;
    } catch {}
    return 'cyber';
  });

  const theme = themes[themeName];

  useEffect(() => {
    const root = document.documentElement;
    const c = theme.colors;
    root.style.setProperty('--color-cyber-bg', c.bg);
    root.style.setProperty('--color-cyber-card', c.card);
    root.style.setProperty('--color-cyber-border', c.border);
    root.style.setProperty('--color-cyber-primary', c.primary);
    root.style.setProperty('--color-cyber-secondary', c.secondary);
    root.style.setProperty('--color-cyber-success', c.success);
    root.style.setProperty('--color-cyber-warning', c.warning);
    root.style.setProperty('--color-cyber-danger', c.danger);
    root.style.setProperty('--color-cyber-text', c.text);
    root.style.setProperty('--color-cyber-muted', c.muted);

    // Update body background
    document.body.style.backgroundColor = c.bg;
    document.body.style.color = c.text;

    // Set data-theme attribute for CSS selectors
    document.documentElement.setAttribute('data-theme', themeName);

    // Update meta theme-color for mobile browsers
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', c.bg);
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, themeName); } catch {}
  }, [themeName]);

  function setTheme(name: ThemeName) {
    setThemeName(name);
  }

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
