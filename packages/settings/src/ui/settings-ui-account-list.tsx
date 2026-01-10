import type { Account } from '@workspace/db/account/account'
import type { NetworkType } from '@workspace/db/network/network-type'
import { ItemGroup } from '@workspace/ui/components/item'
import { SettingsUiAccountListItem } from './settings-ui-account-list-item.tsx'

export function SettingsUiAccountList({
  activeId,
  deleteItem,
  items,
  networkType,
  onMoveDown,
  onMoveUp,
  requestAirdrop,
}: {
  activeId: null | string
  deleteItem: (item: Account) => Promise<void>
  items: Array<{ accounts?: Account[] } & Account>
  networkType: NetworkType
  onMoveDown: (item: Account) => Promise<void>
  onMoveUp: (item: Account) => Promise<void>
  requestAirdrop: (item: Account) => Promise<void>
}) {
  return (
    <ItemGroup className="gap-2 md:gap-4">
      {items.map((item, index) => (
        <SettingsUiAccountListItem
          activeId={activeId}
          deleteItem={deleteItem}
          isFirst={index === 0}
          isLast={index === items.length - 1}
          item={item}
          key={item.id}
          networkType={networkType}
          onMoveDown={onMoveDown}
          onMoveUp={onMoveUp}
          requestAirdrop={requestAirdrop}
        />
      ))}
    </ItemGroup>
  )
}
