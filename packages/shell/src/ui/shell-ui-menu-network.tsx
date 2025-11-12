import type { Network } from '@workspace/db/entity/network'

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from '@workspace/ui/components/menubar'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Link } from 'react-router'

export function ShellUiMenuNetwork({
  active,
  networks,
  setActive,
}: {
  active: Network | undefined
  networks: Network[]
  setActive: (id: string) => Promise<void>
}) {
  return (
    <MenubarMenu>
      <MenubarTrigger className="gap-2 h-8 md:h-12 px-2 md:px-4">
        <UiIcon className="size-4 md:size-6" icon="network" />
        {active?.name ?? 'Select Network'}
      </MenubarTrigger>
      <MenubarContent>
        <MenubarRadioGroup onValueChange={(id) => setActive(id)} value={active?.id ?? ''}>
          {networks
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((network) => (
              <MenubarRadioItem key={network.id} value={network.id}>
                {network.name}
              </MenubarRadioItem>
            ))}
        </MenubarRadioGroup>
        <MenubarSeparator />
        <MenubarItem asChild>
          <Link to="/settings/networks">
            <UiIcon icon="settings" />
            Network settings
          </Link>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
