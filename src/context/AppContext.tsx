import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';
type Role = 'senior' | 'caregiver' | null;

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  role: Role;
  setRole: (role: Role) => void;
  t: (en: string, hi: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [role, setRole] = useState<Role>(null);

  const t = (en: string, hi: string) => language === 'en' ? en : hi;

  return (
    <AppContext.Provider value={{ language, setLanguage, role, setRole, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
