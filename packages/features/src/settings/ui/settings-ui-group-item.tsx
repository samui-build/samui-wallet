import { cn } from '@workspace/ui/lib/utils.js'
import { LucideChevronRight } from 'lucide-react'
import { NavLink } from 'react-router'

import type { SettingsGroup } from '../data-access/settings-group.js'

import { useSettings } from '../data-access/settings-provider.js'
import { SettingsUiGroupHeader } from './settings-ui-group-header.js'

export function SettingsUiGroupItem({ group }: { group: SettingsGroup }) {
  const { basePath } = useSettings()
  return (
    <div>
      <NavLink
        className={({ isActive }) =>
          cn(`p-4 flex justify-between rounded-xl border border-primary/10`, {
            'font-bold text-white': isActive,
            'text-muted-foreground': !isActive,
          })
        }
        to={`${basePath}/${group.id}`}
      >
        <SettingsUiGroupHeader group={group} />
        <LucideChevronRight />
      </NavLink>
    </div>
  )
}
