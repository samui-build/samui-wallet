import './resources.d.ts'
import './i18next.d.ts'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enOnboarding from '../locales/en/onboarding.json' with { type: 'json' }
import esOnboarding from '../locales/es/onboarding.json' with { type: 'json' }

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  lng: 'en',
  resources: {
    en: {
      onboarding: enOnboarding,
    },
    es: {
      onboarding: esOnboarding,
    },
  },
})

export { useTranslation } from 'react-i18next'

export default i18n
