import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  getTranslations,
  type Language,
  type Translations,
} from '../i18n/translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
  const stored = localStorage.getItem('language');
  if (stored === 'en' || stored === 'es') return stored;
  return 'es';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  }

  const t = getTranslations(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
