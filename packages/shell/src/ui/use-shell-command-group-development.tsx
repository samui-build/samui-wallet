import { useSetting } from '@workspace/db-react/use-setting'
import { useTranslation } from '@workspace/i18n'
import type { ShellCommandGroup } from './use-shell-command-groups.tsx'

export function useShellCommandGroupDevelopment(): ShellCommandGroup {
  const { t } = useTranslation('shell')
  const [developerMode, setDeveloperMode] = useSetting('developerModeEnabled')

  return {
    commands: [
      {
        handler: async () => {
          await setDeveloperMode(developerMode === 'true' ? 'false' : 'true')
        },
        label:
          developerMode === 'true' ? t(($) => $.commandDisableDeveloperMode) : t(($) => $.commandEnableDeveloperMode),
      },
    ],
    label: t(($) => $.commandDevelopment),
  }
}
