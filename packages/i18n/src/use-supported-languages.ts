import { useTranslation } from './index.ts'

export function useSupportedLanguages() {
  const { t } = useTranslation()

  return {
    en: t(($) => $.languageEnglish),
    es: t(($) => $.languageSpanish),
  }
}
