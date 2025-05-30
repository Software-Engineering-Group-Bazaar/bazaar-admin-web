import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Predefined language codes
const PREDEFINED_LANG_CODES = ['en', 'de', 'es'];
const API_BASE_URL = import.meta.env.VITE_API_URL;

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: (langs, namespaces) => {
        const lang = langs[0];
        const ns = namespaces[0];

        // Check if it's a predefined language
        if (PREDEFINED_LANG_CODES.includes(lang)) {
          // Load from public/locales directory
          return `/locales/${lang}/${ns}.json`;
        } else {
          // Load from backend API
          return `${API_BASE_URL}/api/translations/${lang}/${ns}`;
        }
      },
    },
  });

// Function to fetch and set supported languages
async function fetchAndSetSupportedLanguages() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/languages`);
    const allLangsFromServer = await response.json();
    i18n.options.supportedLngs = allLangsFromServer.map(l => l.code);
  } catch (error) {
    console.error('Failed to fetch supported languages:', error);
    // Fallback to predefined languages if API call fails
    i18n.options.supportedLngs = PREDEFINED_LANG_CODES;
  }
}

// Call the function on startup
fetchAndSetSupportedLanguages();

export default i18n;
