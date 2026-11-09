import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { en, ar } from '../locales';

export const LANGUAGES = {
    EN: 'en',
    AR: 'ar'
};

export const translations = {
    en,
    ar
};

const LanguageContext = createContext({
    language: LANGUAGES.EN,
    setLanguage: () => {},
    toggleLanguage: () => {},
    isRTL: false,
    t: (key, fallback) => '',
    currentLocale: en
});

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        try {
            return localStorage.getItem('portfolio_lang') || LANGUAGES.EN;
        } catch (e) {
            return LANGUAGES.EN;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('portfolio_lang', language);
        } catch (e) {}

        const isArabic = language === LANGUAGES.AR;
        document.documentElement.lang = language;
        document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
        
        if (isArabic) {
            document.documentElement.classList.add('rtl-mode');
        } else {
            document.documentElement.classList.remove('rtl-mode');
        }
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === LANGUAGES.EN ? LANGUAGES.AR : LANGUAGES.EN));
    };

    const isRTL = language === LANGUAGES.AR;
    const currentLocale = translations[language] || translations.en;

    const t = (key, fallback = '') => {
        const langDict = translations[language] || translations.en;
        const val = langDict[key] ?? translations.en[key] ?? fallback;
        return val !== undefined && val !== '' ? val : key;
    };

    const value = useMemo(() => ({
        language,
        setLanguage,
        toggleLanguage,
        isRTL,
        t,
        currentLocale
    }), [language, isRTL]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
