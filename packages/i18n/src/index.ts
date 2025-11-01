import './resources.d.ts'
import './i18next.d.ts'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslations from '../locales/en/translation.json'
import esTranslations from '../locales/es/translation.json'

i18n.use(initReactI18next).init({
  defaultNS: 'translation',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  lng: 'en',
  resources: {
    en: {
      translation: enTranslations,
    },
    es: {
      translation: esTranslations,
    },
  },
})

export { useTranslation } from 'react-i18next'

export default i18n
