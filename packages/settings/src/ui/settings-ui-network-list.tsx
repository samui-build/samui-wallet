import type { Network } from '@workspace/db/network/network'

import { ItemGroup } from '@workspace/ui/components/item'
import { SettingsUiNetworkListItem } from './settings-ui-network-list-item.tsx'

export function SettingsUiNetworkList({
  activeId,
  deleteItem,
  items,
}: {
  activeId: null | string
  deleteItem: (item: Network) => Promise<void>
  items: Network[]
}) {
  return (
    <ItemGroup className="gap-2 md:gap-4">
      {items.map((item) => (
        <SettingsUiNetworkListItem activeId={activeId} deleteItem={deleteItem} item={item} key={item.id} />
      ))}
    </ItemGroup>
  )
}