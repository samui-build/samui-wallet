import { useTranslation } from '@workspace/i18n'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import type { UiIconName } from '@workspace/ui/components/ui-icon-map'
import { cn } from '@workspace/ui/lib/utils'
import { NavLink, Outlet } from 'react-router'
import { ShellUiMenu } from './shell-ui-menu.tsx'
import { ShellUiWarningExperimental } from './shell-ui-warning-experimental.tsx'

export interface ShellLayoutLink {
  icon: UiIconName
  label: string
  to: string
}

export function ShellUiLayout() {
  const { t } = useTranslation('shell')
  const links: ShellLayoutLink[] = [
    { icon: 'portfolio', label: t(($) => $.portfolioLabel), to: '/portfolio' },
    { icon: 'explorer', label: t(($) => $.explorerLabel), to: '/explorer' },
    { icon: 'tools', label: t(($) => $.toolsLabel), to: '/tools' },
    { icon: 'settings', label: t(($) => $.settingsLabel), to: '/settings' },
  ]

  return (
    <div className="h-full flex flex-col justify-between items-stretch">
      <ShellUiWarningExperimental />
      <header className="bg-secondary/50">
        <ShellUiMenu />
      </header>
      <main className="flex-1 overflow-y-auto p-2 lg:p-4">
        <Outlet />
      </main>
      <footer className="bg-secondary/50 flex justify-between items-center">
        {links.map(({ icon, label, to }) => (
          <NavLink
            className={({ isActive }) =>
              cn('items-center gap-2 py-2 flex flex-col flex-1', {
                'font-bold bg-secondary/60': isActive,
              })
            }
            key={to}
            to={to}
          >
            <UiIcon icon={icon} />
            {label}
          </NavLink>
        ))}
      </footer>
    </div>
  )
}
