import { useSetting } from '@workspace/db-react/use-setting'
import { useTranslation } from '@workspace/i18n'
import { useEffect } from 'react'

export function useThemes() {
  const { t } = useTranslation('settings')

  const themeMap = {
    dark: t(($) => $.themeDark),
    light: t(($) => $.themeLight),
  }

  const [theme, setTheme] = useSetting('theme')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme !== 'light')
  }, [theme])

  return {
    options: Object.entries(themeMap).map(([value, label]) => ({ label, value })),
    setTheme,
    theme,
  }
}
