// src/contexts/ThemeContext.jsx

import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  console.log('ThemeProvider: Component is rendering!'); // Debug log

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    console.log('ThemeProvider: Initial theme from localStorage:', savedTheme); // Debug log
    return savedTheme || 'light';
  });

  useEffect(() => {
    console.log('ThemeProvider: Theme changed or mounted. Applying theme:', theme); // Debug log
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('ThemeProvider: Toggling theme to:', newTheme); // Debug log
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Add a simple element here to see if anything inside the provider renders */}
      {console.log('ThemeProvider: Attempting to render children.')} {/* Debug log */}
      {children}
    </ThemeContext.Provider>
  );
};