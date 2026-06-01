import React, { createContext, useContext } from 'react';
import { translations } from './i18n';

const t = translations.en;

const tr = (key, vars = {}) => {
  let str = t[key] || key;
  Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, v); });
  return str;
};

const LanguageContext = createContext({ tr });

export function LanguageProvider({ children }) {
  return (
    <LanguageContext.Provider value={{ tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}