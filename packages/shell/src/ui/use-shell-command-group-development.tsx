import { useSetting } from '@workspace/db-react/use-setting'
import { useTranslation } from '@workspace/i18n'
import type { ShellCommandGroup } from './use-shell-command-groups.tsx'

export function useShellCommandGroupDevelopment(): ShellCommandGroup {
  const { t } = useTranslation('shell')
  const [developerModeEnabled, setDeveloperModeEnabled] = useSetting('developerModeEnabled')

  return {
    commands: [
      {
        handler: async () => {
          await setDeveloperModeEnabled(developerModeEnabled === 'true' ? 'false' : 'true')
        },
        label:
          developerModeEnabled === 'true'
            ? t(($) => $.commandDisableDeveloperMode)
            : t(($) => $.commandEnableDeveloperMode),
      },
    ],
    label: t(($) => $.commandDevelopment),
  }
}
