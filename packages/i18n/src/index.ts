import './resources.d.ts'
import './i18next.d.ts'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enExplorer from '../locales/en/explorer.json' with { type: 'json' }
import enOnboarding from '../locales/en/onboarding.json' with { type: 'json' }
import enPortfolio from '../locales/en/portfolio.json' with { type: 'json' }
import enSettings from '../locales/en/settings.json' with { type: 'json' }
import enShell from '../locales/en/shell.json' with { type: 'json' }
import enTranslation from '../locales/en/translation.json' with { type: 'json' }
import enUi from '../locales/en/ui.json' with { type: 'json' }
import esExplorer from '../locales/es/explorer.json' with { type: 'json' }
import esOnboarding from '../locales/es/onboarding.json' with { type: 'json' }
import esPortfolio from '../locales/es/portfolio.json' with { type: 'json' }
import esSettings from '../locales/es/settings.json' with { type: 'json' }
import esShell from '../locales/es/shell.json' with { type: 'json' }
import esTranslation from '../locales/es/translation.json' with { type: 'json' }
import esUi from '../locales/es/ui.json' with { type: 'json' }

i18n.use(initReactI18next).init({
  defaultNS: 'translation',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  lng: 'en',
  resources: {
    en: {
      explorer: enExplorer,
      onboarding: enOnboarding,
      portfolio: enPortfolio,
      settings: enSettings,
      shell: enShell,
      translation: enTranslation,
      ui: enUi,
    },
    es: {
      explorer: esExplorer,
      onboarding: esOnboarding,
      portfolio: esPortfolio,
      settings: esSettings,
      shell: esShell,
      translation: esTranslation,
      ui: esUi,
    },
  },
})

export { useTranslation } from 'react-i18next'

export { i18n }

export { useSupportedLanguages } from './use-supported-languages.ts'
