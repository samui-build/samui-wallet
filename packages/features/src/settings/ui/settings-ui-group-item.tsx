import type { SettingsGroup } from '../data-access/settings-group.js'
import { SettingsUiGroupHeader } from './settings-ui-group-header.js'
import { cn } from '@workspace/ui/lib/utils.js'
import { LucideChevronRight } from 'lucide-react'
import { NavLink } from 'react-router'
import { useSettings } from '../data-access/settings-provider.js'

export function SettingsUiGroupItem({ group }: { group: SettingsGroup }) {
  const { basePath } = useSettings()
  return (
    <div>
      <NavLink
        to={`${basePath}/${group.id}`}
        className={({ isActive }) =>
          cn(`p-4 flex justify-between rounded-xl border border-primary/10`, {
            'font-bold text-white': isActive,
            'text-muted-foreground': !isActive,
          })
        }
      >
        <SettingsUiGroupHeader group={group} />
        <LucideChevronRight />
      </NavLink>
    </div>
  )
}
