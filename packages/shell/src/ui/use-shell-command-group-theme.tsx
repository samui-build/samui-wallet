import { useSettingTheme } from '@workspace/db-react/use-setting-theme'
import { useTranslation } from '@workspace/i18n'
import type { ShellCommandGroup } from './use-shell-command-groups.tsx'

export function useShellCommandGroupTheme(): ShellCommandGroup {
  const { t } = useTranslation('shell')
  const { options, setTheme, theme } = useSettingTheme()

  return {
    commands: options.map(({ label, value }) => ({
      disabled: theme === value,
      handler: async () => {
        await setTheme(value)
      },
      label: `${t(($) => $.commandThemeChangeTo)} ${label}`,
    })),
    label: t(($) => $.commandTheme),
  }
}
