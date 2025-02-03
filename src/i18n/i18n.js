import en from './locales/en.json';
import sw from './locales/sw.json';

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: en
  },
  sw: {
    translation: sw
  }
};

// const lang = retrieveData('language') || "en";
const lang = localStorage.getItem('language') || 'en'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  // .use(LanguageDetector)  // Detect user language
  // .use(HttpApi) // Load translation files
  .init({
    resources,
    lng: lang, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    fallbackLng: 'en', // Use English if translation is missing
    debug: true, // Enable debug mode in development
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
  });

  export default i18n;
