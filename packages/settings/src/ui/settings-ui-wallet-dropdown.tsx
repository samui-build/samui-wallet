import type { Wallet } from '@workspace/db/entity/wallet'

import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { LucideWallet2 } from 'lucide-react'
import { Link } from 'react-router'

export function SettingsUiWalletDropdown({
  activeWallet,
  items,
  setActive,
}: {
  activeWallet: undefined | Wallet
  items: Wallet[]
  setActive: (item: Wallet) => Promise<void>
}) {
  if (!activeWallet) {
    return null
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{activeWallet.name}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {items.map((item) => (
          <DropdownMenuItem
            disabled={item.id === activeWallet?.id}
            key={item.id}
            onClick={async () => {
              await setActive(item)
            }}
          >
            {item.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`/settings/accounts/${activeWallet.accountId}`}>
            <LucideWallet2 />
            Wallet settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
