import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', setTheme: () => {}, toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('dark');

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
  }, []);

  const setTheme = () => {};
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);