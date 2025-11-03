import type { Account } from '@workspace/db/entity/account'

import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { UiAvatar } from '@workspace/ui/components/ui-avatar'
import { LucideWallet2 } from 'lucide-react'
import { Link } from 'react-router'

import { SettingsUiAccountItem } from './settings-ui-account-item.tsx'

export function SettingsUiAccountDropdown({
  active,
  items,
  setActive,
}: {
  active: Account | null
  items: Account[]
  setActive: (id: string) => Promise<void>
}) {
  if (!active) {
    return null
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <UiAvatar label={active.name} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {items.map((item) => (
          <DropdownMenuItem
            disabled={item.id === active?.id}
            key={item.id}
            onClick={async () => {
              await setActive(item.id)
            }}
          >
            <SettingsUiAccountItem item={item} />
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings/accounts">
            <LucideWallet2 />
            Account settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
