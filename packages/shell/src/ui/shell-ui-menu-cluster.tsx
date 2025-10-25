import type { Cluster } from '@workspace/db/entity/cluster'

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from '@workspace/ui/components/menubar'
import { LucideNetwork, LucideSettings } from 'lucide-react'
import { Link } from 'react-router'

export function ShellUiMenuCluster({
  active,
  clusters,
  setActive,
}: {
  active: Cluster | undefined
  clusters: Cluster[]
  setActive: (id: string) => Promise<void>
}) {
  return (
    <MenubarMenu>
      <MenubarTrigger className="gap-2 h-8 md:h-12 px-2 md:px-4">
        <LucideNetwork className="size-4 md:size-6" />
        {active?.name ?? 'Select Cluster'}
      </MenubarTrigger>
      <MenubarContent>
        <MenubarRadioGroup onValueChange={(id) => setActive(id)} value={active?.id ?? ''}>
          {clusters
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((cluster) => (
              <MenubarRadioItem key={cluster.id} value={cluster.id}>
                {cluster.name}
              </MenubarRadioItem>
            ))}
        </MenubarRadioGroup>
        <MenubarSeparator />
        <MenubarItem asChild>
          <Link to="/settings/clusters">
            <LucideSettings />
            Cluster settings
          </Link>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
