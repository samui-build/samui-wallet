import { useSetting } from '@workspace/db-react/use-setting'
import { useTranslation } from '@workspace/i18n'
import { useLocation, useNavigate } from 'react-router'
import type { ShellCommandGroup } from './use-shell-command-groups.tsx'

export function useShellCommandGroupNavigate(): ShellCommandGroup {
  const { t } = useTranslation('shell')
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [developerMode] = useSetting('developerModeEnabled')

  const options: { label: string; path: string }[] = [
    {
      label: t(($) => $.labelPortfolio),
      path: '/portfolio',
    },
    {
      label: t(($) => $.labelExplorer),
      path: '/explorer',
    },
    {
      label: t(($) => $.labelTools),
      path: '/tools',
    },
    {
      label: t(($) => $.labelSettings),
      path: '/settings',
    },
  ]

  if (developerMode === 'true') {
    options.push({
      label: t(($) => $.labelDevelopment),
      path: '/dev',
    })
  }

  return {
    commands: options.map(({ label, path }) => ({
      disabled: pathname.startsWith(path),
      handler: async () => {
        await navigate(path)
      },
      label: `${t(($) => $.commandNavigateTo)} ${label}`,
    })),
    label: t(($) => $.commandNavigate),
  }
}
