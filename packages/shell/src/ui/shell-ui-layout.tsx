import { useRootLoaderData } from '@workspace/db-react/use-root-loader-data'
import { useTranslation } from '@workspace/i18n'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import type { UiIconName } from '@workspace/ui/components/ui-icon-map'
import { cn } from '@workspace/ui/lib/utils'
import { NavLink, Outlet } from 'react-router'
import type { ShellFeatureProps } from '../shell-feature.tsx'
import { ShellUiCommandMenu } from './shell-ui-command-menu.tsx'
import { ShellUiMenu } from './shell-ui-menu.tsx'
import { ShellUiMenuActions } from './shell-ui-menu-actions.tsx'
import { ShellUiWarningExperimental } from './shell-ui-warning-experimental.tsx'

export interface ShellLayoutLink {
  icon: UiIconName
  label: string
  to: string
}

export function ShellUiLayout({ browser, context }: ShellFeatureProps) {
  const { t } = useTranslation('shell')
  const data = useRootLoaderData()
  if (!data?.accounts?.length) {
    return null
  }

  const links: ShellLayoutLink[] = [
    { icon: 'portfolio', label: t(($) => $.labelPortfolio), to: '/portfolio' },
    { icon: 'explorer', label: t(($) => $.labelExplorer), to: '/explorer' },
    { icon: 'tools', label: t(($) => $.labelTools), to: '/tools' },
    { icon: 'settings', label: t(($) => $.labelSettings), to: '/settings' },
  ]

  return (
    <div className="h-full flex flex-col justify-between items-stretch">
      <ShellUiWarningExperimental />
      <ShellUiCommandMenu />
      <header className="bg-secondary/50 flex items-center justify-between">
        <ShellUiMenu />
        <div className="pr-2">
          <ShellUiMenuActions browser={browser} context={context} />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-1 md:p-2 lg:p-4">
        <Outlet />
      </main>
      <footer className="bg-secondary/50 flex justify-between items-center">
        {links.map(({ icon, label, to }) => (
          <NavLink
            className={({ isActive }) =>
              cn('items-center truncate text-xs md:text-md gap-1 md:gap-2 pt-2 pb-1 flex flex-col flex-1', {
                'font-semibold bg-secondary/60': isActive,
              })
            }
            key={to}
            to={to}
          >
            <UiIcon className="size-4 md:size-6" icon={icon} />
            {label}
          </NavLink>
        ))}
      </footer>
    </div>
  )
}
