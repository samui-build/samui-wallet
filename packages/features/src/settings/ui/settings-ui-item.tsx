import { LucideChevronRight } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import { NavLink } from 'react-router'
import { SettingsItem } from '../data-access/settings-item.js'
import { SettingsGroup } from '../data-access/settings-group.js'
import { useSettings } from '../data-access/settings-provider.js'

export function SettingsUiItem({ group, item }: { group: SettingsGroup; item: SettingsItem }) {
  const { basePath } = useSettings()
  return (
    <NavLink
      to={`${basePath}/${group.id}/${item.id}`}
      className={({ isActive }) =>
        cn(`p-4 flex justify-between border border-primary/10`, {
          'font-bold text-white': isActive,
          'text-muted-foreground': !isActive,
        })
      }
    >
      <span>{item.name}</span>
      <LucideChevronRight />
    </NavLink>
  )
}
