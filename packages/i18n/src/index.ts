import './resources.d.ts'
import './i18next.d.ts'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enOnboarding from '../locales/en/onboarding.json' with { type: 'json' }
import enPortfolio from '../locales/en/portfolio.json' with { type: 'json' }
import enSettings from '../locales/en/settings.json' with { type: 'json' }
import enShell from '../locales/en/shell.json' with { type: 'json' }
import enUi from '../locales/en/ui.json' with { type: 'json' }
import esOnboarding from '../locales/es/onboarding.json' with { type: 'json' }
import esPortfolio from '../locales/es/portfolio.json' with { type: 'json' }
import esSettings from '../locales/es/settings.json' with { type: 'json' }
import esShell from '../locales/es/shell.json' with { type: 'json' }
import esUi from '../locales/es/ui.json' with { type: 'json' }

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  lng: 'en',
  resources: {
    en: {
      onboarding: enOnboarding,
      portfolio: enPortfolio,
      settings: enSettings,
      shell: enShell,
      ui: enUi,
    },
    es: {
      onboarding: esOnboarding,
      portfolio: esPortfolio,
      settings: esSettings,
      shell: esShell,
      ui: esUi,
    },
  },
})

export { useTranslation } from 'react-i18next'

export { i18n }
