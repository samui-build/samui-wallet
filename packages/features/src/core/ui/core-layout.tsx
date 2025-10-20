import type { UiIconLucide } from '@workspace/ui/components/ui-icon.js'

import { SettingsFeatureAccountDropdown } from '@workspace/settings/settings-feature-account-dropdown'
import { SettingsFeatureClusterDropdown } from '@workspace/settings/settings-feature-cluster-dropdown'
import { SettingsFeatureWalletDropdown } from '@workspace/settings/settings-feature-wallet-dropdown'
import { Toaster } from '@workspace/ui/components/sonner'
import { cn } from '@workspace/ui/lib/utils.js'
import { NavLink, Outlet } from 'react-router'

export interface CoreLayoutLink {
  icon: UiIconLucide
  label: string
  to: string
}

export function CoreLayout({ links }: { links: CoreLayoutLink[] }) {
  return (
    <div className="h-full flex flex-col justify-between items-stretch">
      <header className="bg-secondary/50 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SettingsFeatureAccountDropdown />
          <SettingsFeatureWalletDropdown />
        </div>
        <SettingsFeatureClusterDropdown />
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
      <Toaster richColors />
    </div>
  )
}
