import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [displayLanguage, setDisplayLanguage] = useState(() => {
    return localStorage.getItem('chat_display_language') || 'english';
  });

  const toggleLanguage = () => {
    const newLang = displayLanguage === 'english' ? 'japanese' : 'english';
    setDisplayLanguage(newLang);
    localStorage.setItem('chat_display_language', newLang);
  };

  return (
    <LanguageContext.Provider value={{ 
      displayLanguage, 
      toggleLanguage,
      isJapanese: displayLanguage === 'japanese'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};