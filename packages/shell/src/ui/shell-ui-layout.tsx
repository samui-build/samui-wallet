import type { UiIconLucide } from '@workspace/ui/components/ui-icon'

import { cn } from '@workspace/ui/lib/utils'
import { NavLink, Outlet } from 'react-router'

import { ShellUiMenu } from './shell-ui-menu.tsx'
import { ShellUiWarningExperimental } from './shell-ui-warning-experimental.tsx'

export interface ShellLayoutLink {
  icon: UiIconLucide
  label: string
  to: string
}

export function ShellUiLayout({ links }: { links: ShellLayoutLink[] }) {
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
        {links.map(({ icon: Icon, label, to }) => (
          <NavLink
            className={({ isActive }) =>
              cn('items-center gap-2 py-2 flex flex-col flex-1', {
                'font-bold bg-secondary/60': isActive,
              })
            }
            key={to}
            to={to}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </footer>
    </div>
  )
}
