import { useRootLoaderData } from '@workspace/db-react/use-root-loader-data'
import { useTranslation } from '@workspace/i18n'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import type { UiIconName } from '@workspace/ui/components/ui-icon-map'
import { cn } from '@workspace/ui/lib/utils'
import { NavLink, Outlet } from 'react-router'
import { ShellUiCommandMenu } from './shell-ui-command-menu.tsx'
import { ShellUiMenu } from './shell-ui-menu.tsx'
import { ShellUiMenuActions } from './shell-ui-menu-actions.tsx'
import { ShellUiWarningExperimental } from './shell-ui-warning-experimental.tsx'

export interface ShellLayoutLink {
  icon: UiIconName
  label: string
  to: string
}

export function ShellUiLayout() {
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
    <div className="flex h-full flex-col items-stretch justify-between">
      <ShellUiWarningExperimental />
      <ShellUiCommandMenu />
      <header className="flex items-center justify-between bg-secondary/30">
        <ShellUiMenu />
        <div className="pr-2">
          <ShellUiMenuActions />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-1 md:p-2 lg:p-4">
        <Outlet />
      </main>
      <footer className="flex items-center justify-between bg-secondary/30 pb-[env(safe-area-inset-bottom)]">
        {links.map(({ icon, label, to }) => (
          <NavLink
            className={({ isActive }) =>
              cn('flex flex-1 flex-col items-center gap-1 truncate pt-2 pb-1 text-xs md:gap-2 md:text-md', {
                'bg-secondary/50 font-semibold': isActive,
              })
            }
            key={to}
            prefetch="viewport"
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
