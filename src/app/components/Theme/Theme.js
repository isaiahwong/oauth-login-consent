import React from 'react';

export const themeValue = {
  light: 'light',
  dark: 'dark'
};

export default React.createContext(themeValue.light);
