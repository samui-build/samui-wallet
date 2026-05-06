import type { Network } from '@workspace/db/network/network'

import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Link } from 'react-router'

export function SettingsUiNetworkDropdown({
  activeNetwork,
  items,
  setActive,
}: {
  activeNetwork: Network | undefined
  items: Network[]
  setActive: (id: string) => Promise<void>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <UiIcon icon="network" /> {activeNetwork?.name ?? 'Select Network'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {items.map((item) => (
          <DropdownMenuItem
            disabled={item.id === activeNetwork?.id}
            key={item.id}
            onClick={async () => {
              await setActive(item.id)
            }}
          >
            {item.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings/networks">Network settings</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
