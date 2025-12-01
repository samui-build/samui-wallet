import type { Account } from '@workspace/db/account/account'
import type { Wallet } from '@workspace/db/wallet/wallet'

import { ItemGroup } from '@workspace/ui/components/item'
import { SettingsUiWalletListItem } from './settings-ui-wallet-list-item.tsx'

export function SettingsUiWalletList({
  activeId,
  deleteItem,
  items,
}: {
  activeId: null | string
  deleteItem: (item: Wallet) => Promise<void>
  items: Array<{ accounts?: Account[] } & Wallet>
}) {
  return (
    <ItemGroup className="gap-2 md:gap-4">
      {items.map((item) => (
        <SettingsUiWalletListItem activeId={activeId} deleteItem={deleteItem} item={item} key={item.id} />
      ))}
    </ItemGroup>
  )
}
