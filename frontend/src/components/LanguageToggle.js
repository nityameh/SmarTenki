import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = () => {
  const { toggleLanguage, isJapanese } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg transition-all duration-200 hover:scale-105"
      title={`Switch to ${isJapanese ? 'English' : 'Japanese'}`}
    >
      <span className="text-lg">{isJapanese ? '🇯🇵' : '🇬🇧'}</span>
      <span className="text-sm font-medium">
        {isJapanese ? 'JP' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageToggle;