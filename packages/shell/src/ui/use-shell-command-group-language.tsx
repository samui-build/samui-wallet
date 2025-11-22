import { useSetting } from '@workspace/db-react/use-setting'
import { i18n, useSupportedLanguages, useTranslation } from '@workspace/i18n'
import type { ShellCommandGroup } from './use-shell-command-groups.tsx'

export function useShellCommandGroupLanguage(): ShellCommandGroup {
  const { t } = useTranslation('shell')
  const [language, setLanguageSetting] = useSetting('language')
  const supportedLanguages = useSupportedLanguages()

  async function handleLanguageChange(newLanguage: string) {
    await setLanguageSetting(newLanguage)
    await i18n.changeLanguage(newLanguage)
  }

  return {
    commands: Object.entries(supportedLanguages).map(([code, name]) => ({
      disabled: language === code,
      handler: async () => {
        await handleLanguageChange(code)
      },
      label: `${t(($) => $.commandLanguageChangeTo)} ${name}`,
    })),
    label: t(($) => $.commandLanguage),
  }
}
