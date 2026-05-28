import React, { createContext, useContext, useState } from 'react';
import { TRANSLATIONS, Language } from '../services/localization';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateGrain: (grain: any) => any;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const translateGrain = (grain: any) => {
    if (!grain) return null;
    if (language === 'en') return grain;

    try {
      if (grain.translations_json) {
        const translations = typeof grain.translations_json === 'string'
          ? JSON.parse(grain.translations_json)
          : grain.translations_json;

        const langData = translations[language];
        if (langData) {
          return {
            ...grain,
            name: langData.name || grain.name,
            description: langData.description || grain.description,
            cultivation_info: langData.cultivation_info || grain.cultivation_info,
            uses: langData.uses || grain.uses
          };
        }
      }
    } catch (e) {
      console.warn("Failed to translate grain data: ", e);
    }
    return grain;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, translateGrain }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
