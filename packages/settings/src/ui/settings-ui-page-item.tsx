import { cn } from '@workspace/ui/lib/utils'
import { LucideChevronRight } from 'lucide-react'
import { NavLink } from 'react-router'

import type { SettingsPage } from '../data-access/settings-page.ts'

import { SettingsUiPageHeader } from './settings-ui-page-header.tsx'

export function SettingsUiPageItem({ page }: { page: SettingsPage }) {
  return (
    <div>
      <NavLink
        className={({ isActive }) =>
          cn(`p-4 flex justify-between rounded-xl border border-primary/10`, {
            'font-bold text-white': isActive,
            'text-muted-foreground': !isActive,
          })
        }
        to={`/settings/${page.id}`}
      >
        <SettingsUiPageHeader page={page} />
        <LucideChevronRight />
      </NavLink>
    </div>
  )
}
