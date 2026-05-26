import React, { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => localStorage.getItem('kyau-theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('kyau-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleDark = () => setDark(d => !d);

  return <Ctx.Provider value={{ dark, toggleDark }}>{children}</Ctx.Provider>;
};

export const useTheme = () => useContext(Ctx);
