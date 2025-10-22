import type { Cluster } from '@workspace/db/entity/cluster'

import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { LucideNetwork } from 'lucide-react'
import { Link } from 'react-router'

export function SettingsUiClusterDropdown({
  activeCluster,
  items,
  setActive,
}: {
  activeCluster: Cluster | undefined
  items: Cluster[]
  setActive: (id: string) => Promise<void>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <LucideNetwork /> {activeCluster?.name ?? 'Select Cluster'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {items.map((item) => (
          <DropdownMenuItem
            disabled={item.id === activeCluster?.id}
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
          <Link to="/settings/clusters">Cluster settings</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
