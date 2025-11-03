import type { Account } from '@workspace/db/entity/account'
import type { Wallet } from '@workspace/db/entity/wallet'

import { ItemGroup } from '@workspace/ui/components/item'

import { SettingsUiAccountListItem } from './settings-ui-account-list-item.tsx'

export function SettingsUiAccountList({
  active,
  deleteItem,
  items,
}: {
  active: Account | null
  deleteItem: (item: Account) => Promise<void>
  items: Array<{ wallets?: Wallet[] } & Account>
}) {
  return (
    <ItemGroup className="gap-4">
      {items.map((item) => (
        <SettingsUiAccountListItem active={active} deleteItem={deleteItem} item={item} key={item.id} />
      ))}
    </ItemGroup>
  )
}
