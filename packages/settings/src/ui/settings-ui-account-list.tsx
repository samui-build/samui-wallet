import type { Account } from '@workspace/db/account/account'
import type { NetworkType } from '@workspace/db/network/network-type'
import { ItemGroup } from '@workspace/ui/components/item'
import { SettingsUiAccountListItem } from './settings-ui-account-list-item.tsx'

export function SettingsUiAccountList({
  activeId,
  deleteItem,
  items,
  networkType,
  requestAirdrop,
}: {
  activeId: null | string
  deleteItem: (item: Account) => Promise<void>
  items: Array<{ accounts?: Account[] } & Account>
  networkType: NetworkType
  requestAirdrop: (item: Account) => Promise<void>
}) {
  return (
    <ItemGroup className="gap-2 md:gap-4">
      {items.map((item) => (
        <SettingsUiAccountListItem
          activeId={activeId}
          deleteItem={deleteItem}
          item={item}
          key={item.id}
          networkType={networkType}
          requestAirdrop={requestAirdrop}
        />
      ))}
    </ItemGroup>
  )
}
