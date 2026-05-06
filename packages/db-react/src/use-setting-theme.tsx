import { useTranslation } from '@workspace/i18n'
import { useEffect } from 'react'
import { useSetting } from './use-setting.tsx'

export function useSettingTheme() {
  const { t } = useTranslation('db-react')
  const [theme, setTheme] = useSetting('theme')
  const themeMap = {
    dark: t(($) => $.themeDark),
    light: t(($) => $.themeLight),
  }
  const options = Object.entries(themeMap).map(([value, label]) => ({ label, value }))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme !== 'light')
  }, [theme])

  return {
    options,
    setTheme,
    theme,
  }
}
