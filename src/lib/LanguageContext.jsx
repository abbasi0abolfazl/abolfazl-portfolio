import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from './i18n';

const STORAGE_KEY = 'portfolio_lang';

function getInitialLanguage() {
  if (typeof window === 'undefined') {
    return 'en';
  }

  // 1. Manual user choice always wins
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'fa' || saved === 'en') {
      return saved;
    }
  } catch {
    // Ignore localStorage access failures
  }

  // 2. Fast synchronous browser heuristics
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Tehran')) {
      return 'fa';
    }
    const navLangs = navigator.languages || [navigator.language || ''];
    if (navLangs.some((l) => l && l.toLowerCase().startsWith('fa'))) {
      return 'fa';
    }
  } catch {
    // Ignore Intl/navigator errors
  }

  return 'en';
}

const LanguageContext = createContext({
  lang: 'en',
  dir: 'ltr',
  setLang: () => {},
  toggleLang: () => {},
  tr: (key) => key,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLanguage);

  const dir = lang === 'fa' ? 'rtl' : 'ltr';

  // Apply DOM attributes on mount and on lang change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', dir);
    }
  }, [lang, dir]);

  // Asynchronous Geo-lookup if user hasn't explicitly set a preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let savedPref = null;
    try {
      savedPref = localStorage.getItem(STORAGE_KEY);
    } catch {}

    // If user explicitly chose a language, do not run geo-detection
    if (savedPref === 'fa' || savedPref === 'en') return;

    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const checkGeo = async () => {
      const candidates = [
        '/api/geo',
        `${import.meta.env.VITE_API_URL || 'https://api.abolfazlabbasi.com'}/geo`,
        'https://api.country.is/',
        'https://ipwho.is/',
      ];

      for (const endpoint of candidates) {
        try {
          const res = await fetch(endpoint, {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
          });
          if (!res.ok) continue;
          const data = await res.json();
          // ipwho.is returns country_code, others return country
          const country = (data.country || data.country_code || '').toUpperCase();
          if (country === 'IR' && isMounted) {
            setLangState('fa');
            break;
          } else if (country && country !== 'IR' && isMounted) {
            // Explicit non-IR country: default to English as required
            setLangState('en');
            break;
          }
        } catch {
          // Continue to next candidate or timeout
        }
      }
    };

    checkGeo().finally(() => clearTimeout(timeoutId));

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  const setLang = useCallback((newLang) => {
    setLangState((prev) => {
      const resolved = typeof newLang === 'function' ? newLang(prev) : newLang;
      const validLang = resolved === 'fa' ? 'fa' : 'en';
      try {
        localStorage.setItem(STORAGE_KEY, validLang);
      } catch {}
      return validLang;
    });
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'fa' ? 'en' : 'fa'));
  }, [setLang]);

  const tr = useCallback((key, vars = {}) => {
    const dict = translations[lang] || translations.en;
    let str = dict[key] ?? translations.en[key] ?? key;
    if (typeof str === 'string') {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return str;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, dir, setLang, toggleLang, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
