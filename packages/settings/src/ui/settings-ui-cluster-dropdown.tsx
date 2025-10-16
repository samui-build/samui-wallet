import type { Cluster } from '@workspace/db/entity/cluster'

import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { LucideNetwork } from 'lucide-react'

export function SettingsUiClusterDropdown({
  activeCluster,
  items,
  setActive,
}: {
  activeCluster: Cluster | undefined
  items: Cluster[]
  setActive: (item: Cluster) => Promise<void>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <LucideNetwork /> {activeCluster?.name ?? 'Select Cluster'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {items.map((item) => (
          <DropdownMenuItem
            disabled={item.id === activeCluster?.id}
            key={item.id}
            onClick={async () => {
              await setActive(item)
            }}
          >
            {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
