import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeColors {
  background: string;
  card: string;
  cardSecondary: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  border: string;
  shadow: string;
  success: string;
  accent: string;
}

export const LightTheme: ThemeColors = {
  background: '#F5F7F5',
  card: '#FFFFFF',
  cardSecondary: '#EEF2EE',
  text: '#1E2522',
  textMuted: '#68756F',
  primary: '#2E7D32', // Sage Green
  primaryLight: '#E8F5E9',
  secondary: '#D4AF37', // Wheat Gold
  border: '#E0E6E2',
  shadow: 'rgba(46, 125, 50, 0.08)',
  success: '#388E3C',
  accent: '#E65100'
};

export const DarkTheme: ThemeColors = {
  background: '#0F1411',
  card: '#18201C',
  cardSecondary: '#212A25',
  text: '#ECF2EE',
  textMuted: '#96A59E',
  primary: '#4CAF50', // Vibrant Sage
  primaryLight: '#1B3524',
  secondary: '#FFD700', // Rich Gold
  border: '#2A3530',
  shadow: 'rgba(0, 0, 0, 0.4)',
  success: '#4CAF50',
  accent: '#FF9800'
};

interface ThemeContextType {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Default to Dark Mode as it looks premium

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const colors = isDarkMode ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
