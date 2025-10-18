import type { Account } from '@workspace/db/entity/account'
import type { Wallet } from '@workspace/db/entity/wallet'

import { ItemGroup } from '@workspace/ui/components/item'

import { SettingsUiAccountListItem } from './settings-ui-account-list-item.js'

export function SettingsUiAccountList({
  activeAccountId,
  deleteItem,
  items,
  setActive,
}: {
  activeAccountId: null | string
  deleteItem: (item: Account) => Promise<void>
  items: Array<{ wallets?: Wallet[] } & Account>
  setActive: (item: Account) => Promise<void>
}) {
  return (
    <ItemGroup className="gap-4">
      {items.map((item) => (
        <SettingsUiAccountListItem
          activeAccountId={activeAccountId}
          deleteItem={deleteItem}
          item={item}
          key={item.id}
          setActive={setActive}
        />
      ))}
    </ItemGroup>
  )
}
